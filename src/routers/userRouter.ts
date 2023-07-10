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
    this.router.get('/all', UserController.users)
    this.router.get(
      '/resend-verification-email', 
      UserValidator.resendVerificationEmail(),
      UserController.resendVerificationEmail)
  }

  postRoutes() {
    this.router.post(
      '/signup',
      UserValidator.signup(),
      GlobalMiddleware.checkErrors,
      UserController.signup
    )
  }

  putRoutes() {

  }

  patchRoutes() {
    this.router.patch(
      "/verify",
      UserValidator.verifyEmail(),
      GlobalMiddleware.checkErrors,
      UserController.verifyEmail
    )
  }

  deleteRoutes() {

  }
}

export default new UserRouter().router
