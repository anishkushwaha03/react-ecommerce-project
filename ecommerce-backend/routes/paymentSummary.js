import express from 'express';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    let totalItems = 0;
    let productCostCents = 0;
    let shippingCostCents = 0;

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      const deliveryOption = await DeliveryOption.findById(item.deliveryOptionId);
      
      // Safety check to ensure both exist before calculating
      if (product && deliveryOption) {
        totalItems += item.quantity;
        productCostCents += product.priceCents * item.quantity;
        shippingCostCents += deliveryOption.priceCents;
      }
    }

    const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
    const totalCostCents = totalCostBeforeTaxCents + taxCents;

    res.json({
      totalItems,
      productCostCents,
      shippingCostCents,
      totalCostBeforeTaxCents,
      taxCents,
      totalCostCents
    });
  } catch (error) {
    console.error('Error calculating payment summary:', error);
    res.status(500).json({ error: 'Failed to calculate payment summary' });
  }
});

export default router;