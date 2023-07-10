import { Environment } from ".";

const password = process.env.MONGO_DB_PASSWORD || ''

export const environmentsDev:Environment = {
  db_uri: `mongodb+srv://zhukzhuk:${encodeURIComponent(password)}@nodejs.b2nqzzo.mongodb.net/?retryWrites=true&w=majority`,
}
