import { Schema, model } from "mongoose"
import Utils from "../utils/Utils"

const userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  password: { type: String, require: true },
  reset_password_token: { type: String, require: true, default: null },
  reset_password_token_time: { type: Date, require: true, default: null },
  type: { type: String, require: true },
  status: { type: String, require: true },
  created_at: { type: Date, require: true, default: new Date() },
  updated_at: { type: Date, require: true, default: new Date() },
  email_verified: { type: Boolean, require: true, default: false },
  email_verification_token: { type: String, require: true, default: Utils.generateVerificationToken() },
  email_verification_token_time: { type: Date, require: true, default: Utils.getVerificationTokenTime() }
})

export default model("users", userSchema)
