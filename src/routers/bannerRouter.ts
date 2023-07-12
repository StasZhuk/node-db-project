import { Router } from "express";
import GlobalMiddleware from "../middlewares/GlobalMiddleware";
import Utils from "../utils/Utils";
import FileUploader from "../utils/FileUploader";
import BannerValidator from "../validations/BannerValidator";
import BannerController from "../controllers/bannerController";

class BannerRouter {
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
    this.router.get('/',
      GlobalMiddleware.auth,
      BannerController.getBanners
    )
  }

  postRoutes() {
    this.router.post("/create",
      GlobalMiddleware.auth,
      GlobalMiddleware.isAdminRole,
      new FileUploader().multer.single('banner'),
      BannerValidator.addBanner(),
      GlobalMiddleware.checkErrors,
      BannerController.addBanner
    )
  }

  putRoutes() { }

  patchRoutes() { }

  deleteRoutes() { }
}

export default new BannerRouter().router
