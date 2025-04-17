import express from 'express'  
import dotenv from 'dotenv'
const app = express()
import {connectDB} from './lib/db.js'
import authRoutes from './routes/auth.route.js'

dotenv.config()  
const PORT = process.env.PORT

// middleware
app.use(express.json());

app.use("/api/auth" , authRoutes);

app.listen(PORT , () => {
    console.log("Server is running on port: " + PORT);
    connectDB()
} );