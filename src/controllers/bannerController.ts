import Banner from "../models/Banner"

export default class BannerController {
  static getBanners = async (req, res, next) => {
    try {
      const banners = await Banner.find()
      res.send(banners)
    } catch (error) {
      next(error)
    }
  }

  static addBanner = async (req, res, next) => {
    const path = req.file.path

    try {
      const data = {
        banner: path
      }
      const banner = await new Banner(data).save()
      res.send(banner)
    } catch (error) {
      next(error)
    }
  }
}
