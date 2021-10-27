function getEnv(name: string, fallback?: string): string {
  const value = process.env[`PREACT_APP_${name}`];

  if (typeof value === 'undefined') {
    if (typeof fallback !== 'undefined') {
      return fallback;
    }

    return '';
  }

  return value;
}

export default getEnv;
