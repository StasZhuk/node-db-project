import { type ObjectId, Schema, model } from "mongoose"
import Utils from "../utils/Utils"

export enum UserStatusesEnum {
  active = "active",
  disabled = "disabled",
}

export enum UserRolesEnum {
  admin = "admin",
  user = "user",
}

export type UserRolesTypes = keyof typeof UserRolesEnum
export type UserStatusesTypes = keyof typeof UserStatusesEnum

export interface UserCreate {
  name: string,
  email: string,
  phone: string,
  password: string,
  role: UserRolesTypes,
  status: UserStatusesTypes,
}

export type UserCreated = UserCreate & {
  _id: ObjectId;
  reset_password_token: string | null,
  reset_password_token_time: Date | null,
  created_at: Date,
  updated_at: Date,
  email_verified: boolean,
  email_verification_token: string,
  email_verification_token_time: Date
}

export type UserJwt = {
  aud: any;
  email: string;
  role: UserRolesTypes
}

const userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  password: { type: String, require: true },
  reset_password_token: { type: String, require: true, default: null },
  reset_password_token_time: { type: Date, require: true, default: null },
  role: { type: String, require: true, default: UserRolesEnum.user },
  status: { type: String, require: true, default: UserStatusesEnum.active },
  created_at: { type: Date, require: true, default: new Date() },
  updated_at: { type: Date, require: true, default: new Date() },
  email_verified: { type: Boolean, require: true, default: false },
  email_verification_token: { type: String, require: true, default: Utils.generateVerificationToken() },
  email_verification_token_time: { type: Date, require: true, default: Utils.getVerificationTokenTime() }
})

export default model("users", userSchema)
