function getEnv(name: string, fallback?: string): string {
  const value = process.env[`REACT_APP_${name}`];

  if (typeof value === 'undefined') {
    if (typeof fallback !== 'undefined') {
      return fallback;
    }

    return '';
  }

  return value;
}

export default getEnv;
