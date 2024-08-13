import mongoose from "mongoose";
const { Schema, model } = mongoose;

const settingsSchema = new Schema({
  prefage: String,
  prefgender: String,
  preface: String,
  prefjob: String,
  preforigin: String
  
});


export default model('Settings', settingsSchema);