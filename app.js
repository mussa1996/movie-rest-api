import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import connectDb from './database/dbconnection.js';
import cors from "cors";
import routes from './router/index.js'

const app = express();
connectDb(); 
let corsOptions ={
  origin:'http://localhost:4001', 
  credentials:true,     
  optionSuccessStatus:200
}
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api',routes);
app.get("/",(req, res) => {
  res.status(200).json({
    message: "Welcome to movie app",
    status: "success",
  });
});

// app.post("/api/login",(req,res)=>{
//     jwt.sign()
// })
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server up and running on " + PORT);
});  