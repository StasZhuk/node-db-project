import { validationResult } from 'express-validator';
import Jwt from '../utils/Jwt';

export default class GlobalMiddleware {
  constructor() { }

  static checkErrors(req, res, next) {
    const error = validationResult(req)

    if (!error.isEmpty()) {
      next(new Error(error.array()[0].msg))
    } else {
      next()
    }
  }

  static auth(req, res, next) {
    const authorization = req.headers.authorization
    const token = authorization ? authorization.replace('Bearer ', '') : null
    
    req.errorStatus = 401
    try {
      const encodedToken = Jwt.verify(token)
      req.user = encodedToken
      next()
    } catch (error) {
      next(error)
    }
  }
}
