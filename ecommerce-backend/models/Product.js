import mongoose from 'mongoose';
import crypto from 'crypto';

const productSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    default: () => crypto.randomUUID() 
  },
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    stars: { type: Number, required: true },
    count: { type: Number, required: true }
  },
  priceCents: {
    type: Number,
    required: true
  },
  // Mongoose natively supports arrays, so no getters/setters are needed
  keywords: {
    type: [String],
    required: true
  }
}, { 
  timestamps: true, // Automatically handles createdAt and updatedAt
  toJSON: { virtuals: true }, 
  id: true 
});

export const Product = mongoose.model('Product', productSchema);