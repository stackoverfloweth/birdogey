# Birdogey

[![Netlify Status](https://api.netlify.com/api/v1/badges/a5c6aa9c-d3f1-457e-9ff7-9aeb09632154/deploy-status)](https://app.netlify.com/sites/birdogey/deploys)

## Running the Project Locally

1. open a terminal and run `https://github.com/stackoverfloweth/birdogey.git`
2. change directory into the new project `cd birdogey`
3. (optional) if you have [node version manager](https://github.com/nvm-sh/nvm) (available on brew) you can run `nvm use` to make sure you're using the correct version of node
4. install dependencies with `npm ci`
5. run the project with `npm run dev`
6. enjoy!

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
- This project includes recommended extensions and workspace settings specific to visual studio code.

## Linting

This project is configured to eslint with thanks to @prefecthq for a good eslint-config template.

```bash
npm run lint
```

## Testing

This project is configured to run unit tests with vitest framework.

```bash
npm run test
```
