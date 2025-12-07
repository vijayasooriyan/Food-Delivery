import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"



 //app config
const app = express()
const  port=4000

//middleware
app.use(express.json())
app.use(cors())


// db connection 
connectDB();

//api end points
app.use("/api/food",foodRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

//  mongodb+srv://vijayasooriyan:soorya234@cluster0.se6d5tm.mongodb.net/?appName=Cluster0

