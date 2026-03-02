import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  productId: {
    type: String, // Keeping as String to match the UUIDs from the Product model
    required: true,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true
  },
  deliveryOptionId: {
    type: String, // Keeping as String to match "1", "2", etc.
    required: true,
    ref: 'DeliveryOption'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  id: true
});

export const CartItem = mongoose.model('CartItem', cartItemSchema);