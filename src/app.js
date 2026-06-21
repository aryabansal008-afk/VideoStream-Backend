import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}
));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"));
app.use(cookieParser())

//Routes Import
import router from "./routes/userroutes.js"

//Routes Declaration
app.use("/api/cloudinary/users", router)

//http://localhost:8000/api/cloudinary/users/register
export default app;
