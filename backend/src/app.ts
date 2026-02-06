import express from "express";
import { Request ,Response } from "express";


export const app = express();
app.get("/",(req:Request ,res:Response)=>{
    return res.send("welcome to Banking App");
})
