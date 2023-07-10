import jwt, { SignOptions } from "jsonwebtoken"
import { getEnvironmentVars } from "../environments";

export default class Jwt {
  static sign(payload: object, options: SignOptions = {}): string {
    return jwt.sign(payload, getEnvironmentVars().jwt_secret, options);
  }

  static verify(token: string) {
    return jwt.verify(token, getEnvironmentVars().jwt_secret);
  }
}
