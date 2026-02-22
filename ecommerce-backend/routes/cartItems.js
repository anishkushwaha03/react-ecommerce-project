import express from 'express';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';

const router = express.Router();

// Helper function to format Mongoose document to frontend expected format
const formatCartItem = (item) => {
  const itemObj = item.toJSON();
  itemObj.id = itemObj._id;
  delete itemObj._id;
  delete itemObj.__v;
  return itemObj;
};

router.get('/', async (req, res) => {
  try {
    const expand = req.query.expand;
    // .sort({ createdAt: 1 }) mimics your Sequelize defaultScope order
    let cartItems = await CartItem.find().sort({ createdAt: 1 });

    if (expand === 'product') {
      cartItems = await Promise.all(cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        
        // Format the product to match frontend expectations
        const productObj = product ? product.toJSON() : null;
        if (productObj) {
          productObj.id = productObj._id;
          delete productObj._id;
          delete productObj.__v;
        }

        return {
          ...formatCartItem(item),
          product: productObj
        };
      }));
      return res.json(cartItems);
    }

    res.json(cartItems.map(formatCartItem));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
      return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
    }

    // Mongoose query syntax replaces Sequelize's { where: { productId } }
    let cartItem = await CartItem.findOne({ productId });
    
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ productId, quantity, deliveryOptionId: "1" });
    }

    res.status(201).json(formatCartItem(cartItem));
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, deliveryOptionId } = req.body;

    const cartItem = await CartItem.findOne({ productId });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity !== undefined) {
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be a number greater than 0' });
      }
      cartItem.quantity = quantity;
    }

    if (deliveryOptionId !== undefined) {
      const deliveryOption = await DeliveryOption.findById(deliveryOptionId);
      if (!deliveryOption) {
        return res.status(400).json({ error: 'Invalid delivery option' });
      }
      cartItem.deliveryOptionId = deliveryOptionId;
    }

    await cartItem.save();
    res.json(formatCartItem(cartItem));
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const cartItem = await CartItem.findOne({ productId });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Replace .destroy() with the Mongoose equivalent
    await cartItem.deleteOne(); 
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

export default router;