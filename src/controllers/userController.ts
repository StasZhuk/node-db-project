import User from "../models/User"
import { validationResult } from 'express-validator'
import Utils from "../utils/Utils"

export class UserController {
  constructor() { }

  static signup = async (req, res, next) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
      next(new Error(error.array()[0].msg))
    }

    const {
      name,
      email,
      phone,
      password,
      type,
      status,
    } = req.body

    const userData = {
      name,
      email,
      phone,
      password,
      type: type || "customer",
      status: status || "active",
    }

    console.log(new User(userData))

    // try {
    //   const user = await new User(userData).save()
    //   res.send(user)
    // } catch (error) {
    //   next(error)
    // }

    // user.save()
    //   .then((user) => {
    //     res.status(200).send(user)
    //   })
    //   .catch(err => {
    //     next(err)
    //   })
  }

  static verifyEmail = (req, res, next) => {
    const { verification_token, email } = req.body

    try {
      const user = User.findOneAndUpdate({
        email,
        verification_token,
        verification_token_time: { $gt: Date.now() }
      }, {
        email_verified: true
      }, {
        new: true
      })

      if (user) {
        res.send(user)
      } else {
        throw new Error("Email verification token time is expired, please signup again")
      }
    } catch (error) {
      next(error)
    }
  }

  static users = (req, res) => {
    res.status(200).send("Users")
  }
}

