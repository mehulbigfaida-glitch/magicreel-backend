import "dotenv/config";
import express from "express";
import cors from "cors";
import makeMyMuseRoutes from "./makemymuse.routes";
import { prisma } from "../../magicreel/db/prisma";

const app=express();
app.set("trust proxy",1);
app.use(cors({
  origin: (origin,callback)=>{
    if(!origin)return callback(null,true);
    if(origin.includes("vercel.app")||origin==="https://magicreel.in"||origin==="https://www.magicreel.in"||origin.includes("localhost"))return callback(null,true);
    return callback(new Error("Not allowed by MakeMyMuse CORS"));
  },
  credentials:true,
}));
app.use(express.json({limit:"5mb"}));
app.get("/health",(_req,res)=>res.status(200).json({service:"makemymuse-api",status:"ok"}));
app.get("/",(_req,res)=>res.status(200).send("MakeMyMuse API"));
app.use("/api/makemymuse",makeMyMuseRoutes);
const port=Number(process.env.PORT)||8080;
app.listen(port,"0.0.0.0",async()=>{
  console.log("[MakeMyMuse API] Listening on port "+port);
  try{await prisma.$connect();console.log("[MakeMyMuse API] DB connected");}
  catch(e:any){console.error("[MakeMyMuse API] DB connection failed",e?.message);}
});
process.on("unhandledRejection",(reason)=>console.error("[MakeMyMuse API] unhandled rejection",reason));
