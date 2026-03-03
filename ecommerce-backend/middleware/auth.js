// ecommerce-backend/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

export const protect = async (req, res, next) => {
  let token;
  // Check if the token exists in the headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    // Verify the token and attach the user ID to the request object
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId; 
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};