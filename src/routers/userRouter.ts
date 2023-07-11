import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserValidator } from "../validations/UserValidator";
import GlobalMiddleware from "../middlewares/GlobalMiddleware";

class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router()

    this.getRoutes()
    this.postRoutes()
    this.putRoutes()
    this.patchRoutes()
    this.deleteRoutes()
  }

  getRoutes() {
    this.router.get(
      '/resend-verification-email',
      GlobalMiddleware.auth,
      UserController.resendVerificationEmail)
  }

  postRoutes() {
    this.router.post(
      '/signup',
      UserValidator.signup(),
      GlobalMiddleware.checkErrors,
      UserController.signup
    )

    this.router.post(
      '/login',
      UserValidator.login(),
      GlobalMiddleware.checkErrors,
      UserController.login
    )

    this.router.post(
      "/verify",
      UserValidator.verifyEmailToken(),
      GlobalMiddleware.checkErrors,
      GlobalMiddleware.auth,
      UserController.verifyEmail
    )

    this.router.post(
      "/reset/password-token",
      UserValidator.resetPasswordEmail(),
      GlobalMiddleware.checkErrors,
      UserController.sendResetPasswordToken
      )
      
      this.router.post(
        "/reset/password-confirm",
        UserValidator.resetPasswordConfirm(),
        GlobalMiddleware.checkErrors,
      UserController.resetPassword
    )
  }

  putRoutes() { }

  patchRoutes() { }

  deleteRoutes() { }
}

export default new UserRouter().router
