import Multer from "multer"

const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "." + file.originalname)
  }
})

function fileFilter(req, file, cb) {
  if (file.size > 1000 * 5) {
    cb(null, false)
    console.log("file is too big!")
  }

  cb(null, true)
}

export default class FileUploader {
  public multer = Multer({ storage, fileFilter })
}
