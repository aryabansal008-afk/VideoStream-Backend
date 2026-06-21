import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

import { DB_NAME } from './constants.js';
import connectDB from './db/connectdb.js';
import app from './app.js';


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err)=> {
    console.log("Mongo DB conncection failed ! ", err);
})


// ;(async()=> {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error)=>{
//             console.log("It's not you, it's us! Comming back soon");
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })

//     } catch(error){
//         console.log("ERROR: ", error);
//         throw error
//     }
// })