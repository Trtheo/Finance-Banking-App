import mongoose from "mongoose";


const connectDB = async ()=>{
      try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI){
            throw  new Error("Db is not configured in envirnoment variable");
        }
        await mongoose.connect(mongoURI);
        console.log("Db connected successfull");
           
      }
      catch(error){
        console.log(`Database not conneected ${error}`)
      }
}