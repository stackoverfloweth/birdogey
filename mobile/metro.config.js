const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

// Varlock's babel plugin and metro-config wrapper both spawn `varlock load`
// without setting cwd, so the subprocess walks up from the parent's cwd
// looking for .env.schema. On EAS, xcodebuild's bundle phase has cwd at the
// monorepo root, where there's no schema, so varlock silently returns an
// empty config — ENV.X references stay un-inlined and throw at runtime.
// Force cwd to mobile/ before the wrapper loads.
if (process.cwd() !== projectRoot) {
  process.stderr.write(`[metro.config.js] chdir from ${process.cwd()} to ${projectRoot}\n`);
  process.chdir(projectRoot);
}

const { withVarlockMetroConfig } = require('@varlock/expo-integration/metro-config');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders || []), monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = withVarlockMetroConfig(config);
