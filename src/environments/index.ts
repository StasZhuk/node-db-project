import { environmentsDev } from "./environment.dev";
import { environmentsProd } from "./environment.prod";

export interface Environment {
  db_uri: string;
  nodemailerGmailAccount: string;
  nodemailerGmailPassword: string;
  jwt_secret: string;
}

export const getEnvironmentVars = () => {
  if (process.env.NODE_ENV === 'production') {
    return environmentsProd
  } else {
    return environmentsDev
  }
}
