import dotenv from "dotenv";

dotenv.config();

function getEnvVariable(variable, defaultValue, transformFn = (val) => val) {
  const value = process.env[variable];
  if (!value) return defaultValue;
  return transformFn(value);
}

export default getEnvVariable;

// usage example
/*
const dropDB = getEnvVariable("DROP_DB", false, (val) => val === "true");
// this will return true if DROP_DB is set to "true" in the environment variables, otherwise it will return false
const numUsers = getEnvVariable("NUM_USERS", 50, Number);
// this will return the value of NUM_USERS as a number, or 50 if NUM_USERS is not set
*/
