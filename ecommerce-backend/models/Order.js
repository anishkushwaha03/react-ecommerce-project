import mongoose from 'mongoose';
import crypto from 'crypto';

const orderSchema = new mongoose.Schema({
  userId: { // ADD THIS FIELD
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  _id: {
    type: String,
    default: () => crypto.randomUUID()
  },
  orderTimeMs: {
    type: Number, // Mongoose uses Number for Sequelize's BIGINT
    required: true
  },
  totalCostCents: {
    type: Number,
    required: true
  },
  products: {
    type: Array, // Natively handles JSON arrays
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  id: true
});

export const Order = mongoose.model('Order', orderSchema);