import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (typeof mongoUri !== 'string' || mongoUri.trim() === '') {
    console.error('Configuration error: MONGODB_URI must be set to a non-empty MongoDB connection string.');
    process.exit(1);
  }

  try {
    // Connect using the secure Atlas URI from your .env file
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    process.exit(1); // Exit the process with failure if it can't connect
  }
};
