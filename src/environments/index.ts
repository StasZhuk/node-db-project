import { environmentsDev } from "./environment.dev";
import { environmentsProd } from "./environment.prod";

export interface Environment {
  db_uri: string;
}

export const getEnvironmentVars = () => {
  if (process.env.NODE_ENV === 'production') {
    return environmentsProd
  } else {
    return environmentsDev
  }
}
