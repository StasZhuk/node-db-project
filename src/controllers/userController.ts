import User from "../models/User"
import Utils from "../utils/Utils"
import NodeMailer from "../utils/NodeMailer"
import BCrypt from "../utils/BCrypt"
import Jwt from "../utils/Jwt"

type SendVerifyEmailProps = {
  email: string;
  userName: string;
  subject: string;
  verificationToken: number;
}

export class UserController {
  constructor() { }

  private static generateUserJwtToken(user_id: any, email: string) {
    return Jwt.sign({
      user_id,
      email,
    }, { expiresIn: '180d' })
  }

  static login = async (req, res, next) => {
    const { password } = req.body

    try {
      const isUserPassword = await BCrypt.compare(password, req.user.password)
      
      if (isUserPassword) {
        res.json({
          token: this.generateUserJwtToken(req.user._id, req.user.email),
          user: req.user
        })
      } else {
        throw new Error("Password is incorrect")
      }
    } catch (error) {
      next(error)
    }
  }

  static signup = async (req, res, next) => {
    const {
      name,
      email,
      phone,
      password,
      type,
      status,
    } = req.body

    try {
      const encryptedPassword = await BCrypt.encrypt(password)
      const userData = {
        name,
        email,
        phone,
        password: encryptedPassword,
        type: type || "customer",
        status: status || "active",
      }

      const user = await new User(userData).save()
      const token = this.generateUserJwtToken(user._id, user.email)

      res.json({
        token,
        user
      })

      await this.sendVerifyEmail({
        subject: "Verify your email",
        email: user.email,
        userName: user.name,
        verificationToken: user.verification_token
      })
    } catch (error) {
      next(error)
    }
  }

  static async sendVerifyEmail({ subject, email, userName, verificationToken }: SendVerifyEmailProps) {
    return NodeMailer.sendEmail({
      to: [email],
      subject,
      html: `<h1>Hello, ${userName}! Please verify your Email</h1><p>Link for verification your email: <a href="https://localhost:3000/users/verify?email=${email}&token=${verificationToken}">verify email</a></p>`,
    })
  }

  static async verifyEmail(req, res, next) {
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

  static async resendVerificationEmail(req, res, next) {
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

