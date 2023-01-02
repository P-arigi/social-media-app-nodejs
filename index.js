const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const helmet=require("helmet");
const morgan=require("morgan");
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts")

dotenv.config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://ParigiAkhila:parigiakhila2001@ac-sbthcco-shard-00-00.dropbnq.mongodb.net:27017,ac-sbthcco-shard-00-01.dropbnq.mongodb.net:27017,ac-sbthcco-shard-00-02.dropbnq.mongodb.net:27017/?ssl=true&replicaSet=atlas-g86lxn-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true});
  
  
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users" ,userRoute);
app.use("/api/auth" ,authRoute);
app.use("/api/posts" ,postRoute);

/*app.get("/",(req,res)=>{
    res.send("Welcome to home page")
})
//we are using rest api so, no long this are necessary so I comment it.
app.get("/users",(req,res)=>{
    res.send("Welcome to users page")
})*/


app.listen(8800,()=>{
    console.log("Backend server is running!")
})