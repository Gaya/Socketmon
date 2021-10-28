import envVars from 'preact-cli-plugin-env-vars';

export default function preactConfig(config, env, helpers) {
  envVars(config, env, helpers);
}
