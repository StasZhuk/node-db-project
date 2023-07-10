import bc from "bcrypt"

export default class BCrypt {
  static async encrypt(password: string, saltRounds: number = 10) {
    return bc.hash(password, saltRounds);
  }

  async compare(password: string, hash: string) {
    return bc.compare(password, hash);
  }
}
