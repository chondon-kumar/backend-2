import connectDB from "./Db/index.js";
import dotenv from "dotenv"
import app from "./app.js"
dotenv.config();

const port = process.env.port || 3000;

connectDB()
.then(() => {
    console.log("Database connection successfull");
    app.on ("error", (err) => {
        console.log("Mongodb can not connect to server", err)
    })
    app.listen(port,() => {
        console.log(`Server is running on port : ${port}`)
    })
})
.catch((err) => {
    console.log("Database connection faied", err)
})