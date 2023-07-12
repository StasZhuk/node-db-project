import { validationResult } from 'express-validator';
import Jwt from '../utils/Jwt';
import { JwtPayload } from 'jsonwebtoken';
import { UserRolesEnum } from '../models/User';

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
    
    try {
      if (token === null) {
        req.errorStatus = 401
        next(new Error("Auth token not provided"))
      }

      const encodedToken = Jwt.verify(token)
      req.encodedToken = encodedToken
      next()
    } catch (error) {
      req.errorStatus = 401
      next(new Error("Auth token not provided"))
    }
  }

  static isAdminRole(req, res, next) {
    const { role } = req.encodedToken

    if (role !== UserRolesEnum.admin){
      req.errorStatus = 401
      next(new Error("You role doesn't have permission for this!")) 
    }

    next()
  }
}
