import mongoose from "mongoose";
const { Schema, model } = mongoose;

const characterSchema = new Schema({
  id: String,
  name: String,
  age: String,
  gender: String,
  race: String,
  job: String,
  height: String,
  weight: String,
  origin: String,
  description: String,
});

export default model('Character', characterSchema);