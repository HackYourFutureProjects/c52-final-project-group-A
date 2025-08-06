function getEnv(variable, defaultValue, transformFn = (val) => val) {
  const value = import.meta.env[variable];
  if (value === undefined || value === null) return defaultValue;
  return transformFn(value);
}

export default getEnv;
