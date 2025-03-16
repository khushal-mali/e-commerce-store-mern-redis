import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MONGODB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to mongodb: `, error);
    process.exit(1);
  }
};
