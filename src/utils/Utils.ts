export default class Utils {
  static MAX_VERIFICATION_TIME = 5 * 60 * 1000

  static generateVerificationToken(length: number = 8):string {
    let token = ''

    for (let i = 0; i < length; i++) {
        token += Math.floor(Math.random() * 10)
    }

    return token
  }

  static getVerificationTokenTime(time?:number):number {
    return Date.now() + (time || this.MAX_VERIFICATION_TIME)
  }
}
