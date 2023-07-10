export default class Utils {
  public MAX_VERIFICATION_TIME = 5 * 60 * 1000

  static generateVerificationToken(length: number = 8):number {
    let token = ''

    for (let i = 0; i < length; i++) {
        token += Math.floor(Math.random() * 10)
    }

    return parseInt(token)
  }
}
