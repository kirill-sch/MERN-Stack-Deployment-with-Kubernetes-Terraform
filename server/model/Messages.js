import mongoose from "mongoose";
const { Schema, model } = mongoose;

const messagesSchema = new Schema({
  content: String,
  when: String,
  
});


export default model('Messages', messagesSchema);