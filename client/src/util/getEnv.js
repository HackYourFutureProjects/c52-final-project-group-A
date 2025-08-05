function getEnv(variable, transformFn = (val) => val) {
  const value = import.meta.env[variable];
  if (value === undefined || value === null) return;
  return transformFn(value);
}

export default getEnv;
