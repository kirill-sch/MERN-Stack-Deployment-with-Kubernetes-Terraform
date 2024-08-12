import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({
    path: ['.env.local', '.env']
});


const app = express();
app.use(express.json());

const url = process.env.MONGODB_STRING;

await mongoose.connect(url);

//Endpoints go here




app.listen(3000, () => console.log('Server started on http://localhost:3000'));