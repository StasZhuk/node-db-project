import { body } from "express-validator";
import User from "../models/User";

export class UserValidator {
  constructor() { }

  static signup() {
    return [
      body('name', "Name is required")
        .exists()
        .notEmpty()
        .isString(),

      body('phone', 'Phone is required')
        .exists()
        .notEmpty()
        .isString(),

      body('email', 'Email is required')
        .exists()
        .notEmpty()
        .isEmail()
        .withMessage('Email is incorrect')
        .custom((email, { req }) => {
          return User.findOne({
            email
          }).then((user) => {
            if (user) {
              throw("This Email is already exist")
            }

            return true
          }).catch((error) => {
            throw new Error(error)
          })
        }),

      body('password', "Password is required")
        .isAlphanumeric()
        .isLength({ min: 4 })
        .withMessage("Password min length is 4 character"),

      body('type', 'User role type is required')
        .exists()
        .notEmpty()
        .isString(),

      body('status', 'User status is required')
        .exists()
        .notEmpty()
        .isString(),
    ]
  }

  static verifyEmail() {
    return [
      body('verification_token', 'Verification token is required')
      .exists()
      .notEmpty()
      .isString(),

      body('email', 'Email is required')
        .exists()
        .notEmpty()
        .isEmail()
        .withMessage('Email is incorrect'),
    ]
  }
}
