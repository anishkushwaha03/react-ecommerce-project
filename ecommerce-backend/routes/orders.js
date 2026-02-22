import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { CartItem } from '../models/CartItem.js';

const router = express.Router();

const formatDocument = (doc) => {
  const obj = doc.toJSON ? doc.toJSON() : doc;
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
  }
  delete obj.__v;
  return obj;
};

router.get('/', async (req, res) => {
  try {
    const expand = req.query.expand;
    // Retrieve orders sorted by most recent
    let orders = await Order.find().sort({ orderTimeMs: -1 });

    if (expand === 'products') {
      orders = await Promise.all(orders.map(async (order) => {
        const formattedOrder = formatDocument(order);
        const products = await Promise.all(formattedOrder.products.map(async (product) => {
          const productDetails = await Product.findById(product.productId);
          return {
            ...product,
            product: productDetails ? formatDocument(productDetails) : null
          };
        }));
        return {
          ...formattedOrder,
          products
        };
      }));
      return res.json(orders);
    }

    res.json(orders.map(formatDocument));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', async (req, res) => {
  try {
    const cartItems = await CartItem.find();

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let totalCostCents = 0;
    const products = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      
      const deliveryOption = await DeliveryOption.findById(item.deliveryOptionId);
      if (!deliveryOption) throw new Error(`Invalid delivery option: ${item.deliveryOptionId}`);
      
      const productCost = product.priceCents * item.quantity;
      const shippingCost = deliveryOption.priceCents;
      totalCostCents += productCost + shippingCost;
      
      const estimatedDeliveryTimeMs = Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000;
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        estimatedDeliveryTimeMs
      };
    }));

    totalCostCents = Math.round(totalCostCents * 1.1);

    const order = await Order.create({
      orderTimeMs: Date.now(),
      totalCostCents,
      products
    });

    // Clear the cart
    await CartItem.deleteMany({});

    res.status(201).json(formatDocument(order));
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const expand = req.query.expand;

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let formattedOrder = formatDocument(order);

    if (expand === 'products') {
      const products = await Promise.all(formattedOrder.products.map(async (product) => {
        const productDetails = await Product.findById(product.productId);
        return {
          ...product,
          product: productDetails ? formatDocument(productDetails) : null
        };
      }));
      formattedOrder = { ...formattedOrder, products };
    }

    res.json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

export default router;