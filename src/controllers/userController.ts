import User from "../models/User"
import Utils from "../utils/Utils"
import NodeMailer from "../utils/NodeMailer"
import BCrypt from "../utils/BCrypt"
import Jwt from "../utils/Jwt"

type SendVerifyEmailProps = {
  email: string;
  userName: string;
  subject?: string;
  verificationToken: string;
}

type VerifyEmailBody = {
  email_verification_token: string
}

export class UserController {
  constructor() { }

  private static generateUserJwtToken(userId: any, email: string) {
    return Jwt.sign({
      aud: userId,
      email,
    }, { expiresIn: '180d' })
  }

  private static async sendResetPasswordEmail({ email, userName, verificationToken }: SendVerifyEmailProps) {
    return NodeMailer.sendEmail({
      to: [email],
      subject: "Reset password information",
      html: `<h1>Hello, ${userName}! Use this token to reset your password</h1><p>Verification token: ${verificationToken}</p>`,
    })
  }

  private static async sendVerifyEmail({ subject, email, userName, verificationToken }: SendVerifyEmailProps) {
    return NodeMailer.sendEmail({
      to: [email],
      subject,
      html: `<h1>Hello, ${userName}! Please verify your Email</h1><p>Link for verification your email: <a href="https://localhost:3000/users/verify?email=${email}&token=${verificationToken}">verify email</a></p>`,
    })
  }

  static login = async (req, res, next) => {
    const { password } = req.body

    try {
      const isUserPassword = await BCrypt.compare(password, req.user.password)

      if (isUserPassword) {
        const token = this.generateUserJwtToken(req.user._id, req.user.email)
        res.json({ token, user: req.user })
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
        type: type || "user",
        status: status || "active",
      }

      const user = await new User(userData).save()
      const token = this.generateUserJwtToken(user._id, user.email)

      res.json({ token, user })
      await this.sendVerifyEmail({
        subject: "Verify your email",
        email: user.email,
        userName: user.name,
        verificationToken: user.email_verification_token
      })
    } catch (error) {
      next(error)
    }
  }

  static resendVerificationEmail = async (req, res, next) => {
    const { email } = req.encodedToken
    const email_verification_token = Utils.generateVerificationToken()
    const email_verification_token_time = Utils.getVerificationTokenTime()

    try {
      const user = await User.findOneAndUpdate({
        email
      }, {
        email_verification_token,
        email_verification_token_time,
        updated_at: new Date(),
      })

      if (user) {
        res.send({ success: true })
        await this.sendVerifyEmail({
          subject: "Resend verification email",
          email,
          userName: user.name,
          verificationToken: user.email_verification_token
        })
      } else {
        throw new Error("Resend verification email error: user isn't exist")
      }
    } catch (error) {
      next(error)
    }
  }

  static verifyEmail = async (req, res, next) => {
    const { email_verification_token } = req.body as VerifyEmailBody
    const { email } = req.encodedToken

    try {
      const user = await User.findOneAndUpdate({
        email,
        email_verification_token,
        email_verification_token_time: { $gt: Date.now() }
      }, {
        email_verified: true,
        updated_at: new Date(),
      }, {
        new: true
      })

      if (user) {
        res.send({ success: true })
      } else {
        throw new Error("Wrong verification token or verification time is expired, please signup again")
      }
    } catch (error) {
      next(error)
    }
  }


  static sendResetPasswordToken = async (req, res, next) => {
    const { email } = req.user
    const resetPasswordToken = Utils.generateVerificationToken()

    try {
      const user = await User.findOneAndUpdate({
        email
      }, {
        reset_password_token: resetPasswordToken,
        reset_password_token_time: Utils.getVerificationTokenTime(),
        updated_at: new Date(),
      })

      if (user) {
        res.send({ success: true })
        await this.sendResetPasswordEmail({
          email: email,
          userName: user.name,
          verificationToken: resetPasswordToken
        })
      } else {
        throw new Error("User with this email isn't exist")
      }
    } catch (error) {
      next(error)
    }
  }

  static resetPassword = async (req, res, next) => {
    const { reset_password_token, new_password, email } = req.body

    try {
      const encryptedPassword = await BCrypt.encrypt(new_password)
      const user = await User.findOneAndUpdate({
        email,
        reset_password_token,
        reset_password_token_time: { $gt: Date.now() }
      }, {
        password: encryptedPassword,
        updated_at: new Date(),
      }, {
        new: true
      })

      if (user) {
        res.send(user)
      } else {
        throw new Error("Wrong verification token or verification time is expired, please try again")
      }
    } catch (error) {
      next(error)
    }
  }
}

