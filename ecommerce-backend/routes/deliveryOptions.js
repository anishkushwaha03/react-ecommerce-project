import express from 'express';
import { DeliveryOption } from '../models/DeliveryOption.js';

const router = express.Router();

const formatDeliveryOption = (option) => {
  const optionObj = option.toJSON();
  optionObj.id = optionObj._id;
  delete optionObj._id;
  delete optionObj.__v;
  return optionObj;
};

router.get('/', async (req, res) => {
  try {
    const expand = req.query.expand;
    // .sort({ createdAt: 1 }) mimics your Sequelize defaultScope
    const deliveryOptions = await DeliveryOption.find().sort({ createdAt: 1 });

    let response = deliveryOptions;

    if (expand === 'estimatedDeliveryTime') {
      response = deliveryOptions.map(option => {
        const deliveryTimeMs = Date.now() + option.deliveryDays * 24 * 60 * 60 * 1000;
        return {
          ...formatDeliveryOption(option),
          estimatedDeliveryTimeMs: deliveryTimeMs
        };
      });
    } else {
      response = deliveryOptions.map(formatDeliveryOption);
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching delivery options:', error);
    res.status(500).json({ error: 'Failed to fetch delivery options' });
  }
});

export default router;