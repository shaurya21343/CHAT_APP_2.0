import mongoose from "mongoose";

const connectMongoDB = async (mongoURL: string) => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB");
    } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
    }
};
export default connectMongoDB;