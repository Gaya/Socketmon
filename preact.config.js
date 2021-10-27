import envVars from 'preact-cli-plugin-env-vars';
import tailwind from 'preact-cli-tailwind';

export default function preactConfig(config, env, helpers) {
  envVars(config, env, helpers);
  tailwind(config, env, helpers);
}
