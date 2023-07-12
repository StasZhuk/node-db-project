import { Schema, model } from "mongoose";

const bannerSchema = new Schema({
  banner: { type: String, require: true },
  active: { type: Boolean, require: true, default: true },
  created_at: { type: Date, require: true, default: new Date() },
  updated_at: { type: Date, require: true, default: new Date() },
})

export default model("banners", bannerSchema)
