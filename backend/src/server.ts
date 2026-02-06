import  express  from "express";
import { app } from "./app";

import connectDB from "./config/db";
import dotenv from "dotenv";

dotenv.config({});
const PORT = Number(process.env.PORT)|| 3000;
connectDB();
app.listen(PORT ,()=>{
    console.log("serve is up and runnign to port",PORT);
})
