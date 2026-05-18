// Force cwd to this dir before requiring the varlock babel plugin. Its
// `loadVarlockConfig()` runs at module load and spawns `varlock load` as
// a subprocess that inherits cwd from this worker. On EAS the worker's
// inherited cwd isn't mobile/, so varlock can't find .env.schema and
// returns an empty config (silently — no error, just ENV.X references
// survive inlining and the runtime proxy throws).
if (process.cwd() !== __dirname) {
  process.stderr.write(`[babel.config.js] chdir from ${process.cwd()} to ${__dirname}\n`);
  process.chdir(__dirname);
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require('@varlock/expo-integration/babel-plugin'),
      ['module-resolver', { alias: { '@': './src' } }],
    ],
  };
};
