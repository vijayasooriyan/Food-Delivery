import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import'dotenv/config.js'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import chatRouter from "./routes/chatRoute.js"


 //app config
const app = express()
const  port=process.env.PORT || 4000

//middleware
app.use(express.json())
app.use(cors({
  origin: [
    "https://food-delivery-lime-ten.vercel.app",
    "https://food-delivery-1ku6.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ]
}))


// db connection 
connectDB();

//api end points
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/chat", chatRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})

// 404 handler for undefined routes
app.use((req,res)=>{
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl
    })
})

// Global error handler
app.use((err,req,res,next)=>{
    console.error("Server Error:", err)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : {}
    })
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
