import mongoose from "mongoose";
const { Schema, model } = mongoose;

const settingSchema = new Schema({
  prefAge: String,
  prefGender: String,
  prefRace: String,
  prefJob: String,
  prefOrigin: String
});

export default model('Setting', settingSchema);