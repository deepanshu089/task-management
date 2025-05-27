const mongoose = require('mongoose');

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options like useNewUrlParser, useUnifiedTopology, etc.
      // These are true by default in recent Mongoose versions
    });
    cachedDb = db;
    console.log('New database connection established');
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // In a serverless context, re-throwing the error allows the function to fail
    throw err;
  }
};

module.exports = connectDB; 