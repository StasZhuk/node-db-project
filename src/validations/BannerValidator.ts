import { body } from "express-validator"

export default class BannerValidator {
  static addBanner = () => {
    return [
      body("banner")
        .custom((_, { req }) => {
          if (req.file) {
            return true
          }

          throw("File not provided")
        })
    ]
  }
}
