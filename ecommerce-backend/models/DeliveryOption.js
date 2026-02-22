import mongoose from 'mongoose';

const deliveryOptionSchema = new mongoose.Schema({
  // Override Mongoose's default ObjectId to keep using string IDs like "1" and "2"
  _id: { 
    type: String, 
    required: true 
  },
  deliveryDays: {
    type: Number,
    required: true
  },
  priceCents: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  id: true
});

export const DeliveryOption = mongoose.model('DeliveryOption', deliveryOptionSchema);