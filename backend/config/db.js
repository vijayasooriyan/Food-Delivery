import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://vijayasooriyan:soorya234@cluster0.se6d5tm.mongodb.net/food-del').then(()=>console.log("DB connected"));
}