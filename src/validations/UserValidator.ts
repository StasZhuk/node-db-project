import { UserRolesEnum, UserRolesTypes } from './../models/User';
import { body } from "express-validator";
import User from "../models/User";

const checkUserByEmail = (email, { req }) => {
  return User.findOne({
    email
  }).then((user) => {
    if (user) {
      req.user = user
      return true
    }

    throw ("User with this Email is not exist")
  }).catch((error) => {
    throw new Error(error)
  })
}

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
              throw ("This Email is already exist")
            }

            return true
          }).catch((error) => {
            throw new Error(error)
          })
        }),

      body('password', "Password is required")
        .isString()
        .isLength({ min: 4 })
        .withMessage("Password min length is 4 character"),

      body('role', 'User role type is required')
        .exists()
        .notEmpty()
        .isString()
        .custom((role) => {
          const userRolesValues = Object.values(UserRolesEnum)

          if (userRolesValues.includes(role)) {
            return true
          }

          throw (`role is incorrect, you can use only one of this ${JSON.stringify(userRolesValues)}`)
        }),

      body('status', 'User status is required')
        .exists()
        .notEmpty()
        .isString(),
    ]
  }

  static login() {
    return [
      body('email', 'Email is required')
        .exists()
        .notEmpty()
        .isEmail()
        .withMessage('Email is incorrect')
        .custom(checkUserByEmail),

      body('password', "Password is required")
        .isString()
        .isLength({ min: 4 })
        .withMessage("Password min length is 4 character"),
    ]
  }

  static verifyEmailToken() {
    return [
      body('email_verification_token', 'Verification token is required')
        .exists()
        .notEmpty()
        .isString()
    ]
  }

  static resetPasswordEmail() {
    return [
      body('email', "Email is required")
        .exists()
        .notEmpty()
        .isEmail()
        .withMessage('Email is incorrect')
        .custom(checkUserByEmail),
    ]
  }

  static resetPasswordConfirm() {
    return [
      body('email', "Email is required")
        .exists()
        .notEmpty()
        .isEmail()
        .withMessage('Email is incorrect'),
      body('reset_password_token', "Reset password token is required")
        .exists()
        .notEmpty()
        .isString(),
      body('new_password', "New Password is required")
        .isString()
        .isLength({ min: 4 })
        .withMessage("Password min length is 4 character"),
    ]
  }
}
