import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import adminRouter from './routes/admin';


import * as dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/admin', adminRouter)


//connect to mongoDB
const mongoUri: string = process.env.MONGODB || ''
mongoose.connect(mongoUri, {  dbName: "CourseApp" });


app.listen(3000, () => console.log('Server running on port 3000'));
