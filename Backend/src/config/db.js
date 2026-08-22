import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/education_platform';
    await mongoose.connect(connStr, {
      directConnection: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};

export default connectDB;
