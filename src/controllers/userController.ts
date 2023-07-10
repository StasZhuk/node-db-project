import User from "../models/User"
import { validationResult } from 'express-validator'
import Utils from "../utils/Utils"
import NodeMailer from "../utils/NodeMailer"

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

    try {
      const user = await new User(userData).save()
      await NodeMailer.sendEmail({
        to: [email],
        subject: "Verify your email",
        html: `<h1>Hello, ${user.name}! Please verify your Email</h1><p>Link for verification your email: <a href="https://localhost:3000/users/verify?email=${user.email}&token=${user.verification_token}">verify email</a></p>`,
      })
      res.send(user)
    } catch (error) {
      next(error)
    }

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
    // console.log(req)

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

      console.log("user", user)

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

