import express from 'express';
// Removed the sequelize import
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { CartItem } from '../models/CartItem.js';
import { Order } from '../models/Order.js';
import { defaultProducts } from '../defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from '../defaultData/defaultDeliveryOptions.js';
import { defaultCart } from '../defaultData/defaultCart.js';
import { defaultOrders } from '../defaultData/defaultOrders.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Drop all existing documents in the database
    await Product.deleteMany({});
    await DeliveryOption.deleteMany({});
    await CartItem.deleteMany({});
    await Order.deleteMany({});

    const timestamp = Date.now();

    // Map default data to include Mongoose's _id and timestamps
    const productsWithTimestamps = defaultProducts.map((product, index) => ({
      ...product,
      _id: product.id,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map((option, index) => ({
      ...option,
      _id: option.id,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
      ...item,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    const ordersWithTimestamps = defaultOrders.map((order, index) => ({
      ...order,
      _id: order.id,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    // Insert the data into MongoDB
    await Product.insertMany(productsWithTimestamps);
    await DeliveryOption.insertMany(deliveryOptionsWithTimestamps);
    await CartItem.insertMany(cartItemsWithTimestamps);
    await Order.insertMany(ordersWithTimestamps);

    res.status(204).send();
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

export default router;