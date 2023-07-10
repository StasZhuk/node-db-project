import User from "../models/User"
import { validationResult } from 'express-validator'
import Utils from "../utils/Utils"
import NodeMailer from "../utils/NodeMailer"

type SendVerifyEmailProps = {
  email: string;
  userName: string;
  subject: string;
  verificationToken: number;
}

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
      await this.sendVerifyEmail({
        subject: "Verify your email",
        email: user.email,
        userName: user.name,
        verificationToken: user.verification_token
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

  static sendVerifyEmail = async ({ subject, email, userName, verificationToken }:SendVerifyEmailProps) => {
    return NodeMailer.sendEmail({
      to: [email],
      subject,
      html: `<h1>Hello, ${userName}! Please verify your Email</h1><p>Link for verification your email: <a href="https://localhost:3000/users/verify?email=${email}&token=${verificationToken}">verify email</a></p>`,
    })
  }

  static verifyEmail = async (req, res, next) => {
    const { verification_token, email } = req.body

    try {
      const user = await User.findOneAndUpdate({
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

  static resendVerificationEmail = async (req, res, next) => {
    const email = req.query.email
    const verification_token = Utils.generateVerificationToken()
    const verification_token_time = Utils.getVerificationTokenTime()

    try {
      const user = await User.findOneAndUpdate({
        email
      }, {
        verification_token,
        verification_token_time
      }, {
        new: true
      })

      if (user) {
        await this.sendVerifyEmail({
          subject: "Resend verification email",
          email,
          userName: user.name,
          verificationToken: user.verification_token
        })
        res.send({ success: true })
      } else {
        throw new Error("Resend verification email error: user isn't exist")
      }
    } catch (error) {
      next(error)
    }
  }
}

