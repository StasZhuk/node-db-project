import { Environment } from ".";

const password = process.env.MONGO_DB_PASSWORD || ''

export const environmentsProd:Environment = {
  db_uri: `mongodb+srv://zhukzhuk:${encodeURIComponent(password)}@nodejs.b2nqzzo.mongodb.net/?retryWrites=true&w=majority`,
  nodemailerGmailAccount: process.env.NODEMAILER_GMAIL_ACCOUNT,
  nodemailerGmailPassword: process.env.NODEMAILER_GMAIL_PASSWORD,
}
