import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    let products;

    if (search) {
      // Create a case-insensitive regular expression for the search term
      const searchRegex = new RegExp(search, 'i');

      // Query MongoDB directly to find matches in 'name' OR 'keywords'
      products = await Product.find({
        $or: [
          { name: searchRegex },
          { keywords: searchRegex }
        ]
      }).sort({ createdAt: 1 }); // Mimics your Sequelize defaultScope order
    } else {
      // Find all products if no search query exists
      products = await Product.find().sort({ createdAt: 1 });
    }

    // Map the results to ensure the 'id' property matches the frontend expectations
    const formattedProducts = products.map(product => {
      const productObj = product.toJSON();
      productObj.id = productObj._id;
      delete productObj._id;
      delete productObj.__v; // Remove Mongoose version key
      return productObj;
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;