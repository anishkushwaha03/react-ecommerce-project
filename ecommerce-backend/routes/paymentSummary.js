import express from 'express';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user });
    let totalItems = 0;
    let productCostCents = 0;
    let shippingCostCents = 0;

    const productIds = [...new Set(cartItems.map((item) => item.productId.toString()))];
    const deliveryOptionIds = [...new Set(cartItems.map((item) => item.deliveryOptionId.toString()))];

    const [products, deliveryOptions] = await Promise.all([
      Product.find({ _id: { $in: productIds } }),
      DeliveryOption.find({ _id: { $in: deliveryOptionIds } })
    ]);

    const productsById = new Map(products.map((product) => [product._id.toString(), product]));
    const deliveryOptionsById = new Map(deliveryOptions.map((deliveryOption) => [deliveryOption._id.toString(), deliveryOption]));

    for (const item of cartItems) {
      const product = productsById.get(item.productId.toString());
      const deliveryOption = deliveryOptionsById.get(item.deliveryOptionId.toString());

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
