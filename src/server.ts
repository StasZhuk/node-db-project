import express, { Application } from "express"
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'

import { getEnvironmentVars } from "./environments"
import userRouter from "./routers/userRouter"
import bannerRouter from "./routers/bannerRouter"

export default class Server {
  public app: Application = express()

  constructor() {
    this.setConfigs()
    this.setRoutes()
    this.error404Handler()
    this.errorsHandler()
  }

  setConfigs() {
    this.connectDB()
    this.configBodyParser()
    this.allowCors()
  }

  connectDB() {
    mongoose.connect(getEnvironmentVars().db_uri)
      .then(() => {
        console.log("connect to mongoDB")
      })
      .catch((error) => {
        console.log("Error: ", error)
      })
  }

  configBodyParser() {
    this.app.use(bodyParser.urlencoded({
      extended: true
    }))

    // this.app.use(bodyParser.json())
  }

  allowCors() {
    this.app.use(cors())
  }

  setRoutes() {
    this.app.use('/src/uploads', express.static("src/uploads"))
    this.app.use('/api/users', userRouter)
    this.app.use('/api/banners', bannerRouter)
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Page not found",
        status_code: 404,
      })
    })
  }

  errorsHandler() {
    this.app.use((error, req, res, next) => {
      const status_code = req.errorStatus || 500

      res.status(status_code).json({
        message: error.message || "Something went wrong",
        status_code
      })
    })
  }
}
