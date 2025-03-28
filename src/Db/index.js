import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log("MongoDb connection Successful on : ",connectionInstance.connection.host);
       console.log(`\n MongoDb connect to : ${connectionInstance.connection.name}`);
       console.log(`\n MongoDb running Port : ${connectionInstance.connection.port}`);
       
    } catch (error) {
        console.log("Mongdb connection Failed",error);
        process.exit(1);

    }
}
export default connectDB;