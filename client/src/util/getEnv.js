function getEnv(variable, transformFn = (val) => val) {
  const value = import.meta.env[variable];
  if (value === undefined || value === null)
    throw new Error(`Environment variable ${variable} is not defined.`);
  if (transformFn) return transformFn(value);
  return value;
}

export default getEnv;
