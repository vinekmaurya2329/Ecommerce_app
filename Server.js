import express  from "express";
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from "./config/db.js";
import morgan from 'morgan';
import authRoute from './routes/authRoute.js';
import cors from 'cors';
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from  "./routes/productRoutes.js" 
import path from 'path';
import {fileURLToPath} from 'url';
 
// import colors from "colors"
const app = express();

//  middleware---
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'./client/build')))

dotenv.config(); 

// database config--
connectDB();

// esmodule fix 
const __filename = fileURLToPath(import.meta.url);
const __dirname =path.dirname(__filename);

//  route ---
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product',productRoutes)

const port = process.env.port || 4000;

app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
})

app.listen(4000,()=>{
    console.log(`server is started on port ${port}`)
})   
