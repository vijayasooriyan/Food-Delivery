import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://vijayasooriyan:soorya234@cluster0.se6d5tm.mongodb.net/food-del?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error:", error.message);
  }
};
