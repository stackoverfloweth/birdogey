// Force every `varlock` subprocess to run with cwd=this directory so it
// finds .env.schema regardless of what cwd the metro worker happens to
// have. The babel plugin in @varlock/expo-integration calls execSync
// without passing cwd, so its subprocess inherits whatever metro gave
// the worker - on EAS that's not mobile/. Result: varlock walks up from
// the wrong place, finds no schema, returns empty config, ENV.X
// references survive inlining, runtime proxy throws "ENV not
// initialized". Monkey-patching execSync/execFileSync to inject cwd is
// the only way to force the subprocess to look in the right place
// without modifying node_modules.
const child_process = require('child_process');
const projectRoot = __dirname;

process.stderr.write(`[babel.config.js] cwd=${process.cwd()} projectRoot=${projectRoot}\n`);

const originalExecSync = child_process.execSync;
const originalExecFileSync = child_process.execFileSync;

function looksLikeVarlock(target) {
  if (typeof target !== 'string') return false;
  if (target === 'varlock') return true;
  if (target.endsWith('/varlock') || target.endsWith('\\varlock')) return true;
  return /^varlock(\s|$)/.test(target);
}

child_process.execSync = function patchedExecSync(command, options) {
  if (looksLikeVarlock(command) && !(options && options.cwd)) {
    process.stderr.write(`[babel.config.js] injecting cwd=${projectRoot} into varlock execSync\n`);
    options = { ...options, cwd: projectRoot };
  }
  return originalExecSync.call(this, command, options);
};

child_process.execFileSync = function patchedExecFileSync(file, args, options) {
  if (looksLikeVarlock(file) && !(options && options.cwd)) {
    process.stderr.write(`[babel.config.js] injecting cwd=${projectRoot} into varlock execFileSync\n`);
    options = { ...options, cwd: projectRoot };
  }
  return originalExecFileSync.call(this, file, args, options);
};

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
