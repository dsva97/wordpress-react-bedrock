const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const { externalGlobalPlugin } = require("esbuild-plugin-external-global");
const cssModulesPlugin = require("esbuild-css-modules-plugin");

const getIndexPathFromDir = (dirPath) => {
  let indexFilePath;

  const indexJSPath = path.resolve(dirPath, "index.js");
  const indexJS = fs.existsSync(indexJSPath);

  const indexTSPath = path.resolve(dirPath, "index.ts");
  const indexTS = fs.existsSync(indexTSPath);

  const indexJSXPath = path.resolve(dirPath, "index.jsx");
  const indexJSX = fs.existsSync(indexJSXPath);

  const indexTSXPath = path.resolve(dirPath, "index.tsx");
  const indexTSX = fs.existsSync(indexTSXPath);

  if (indexJS) indexFilePath = indexJSPath;
  if (indexTS) indexFilePath = indexTSPath;
  if (indexJSX) indexFilePath = indexJSXPath;
  if (indexTSX) indexFilePath = indexTSXPath;

  return indexFilePath;
};

const srcPath = path.resolve(__dirname, "src");
const allCmpDirPath = path.resolve(srcPath, "components");
const componentsIndexPaths = fs
  .readdirSync(allCmpDirPath)
  .filter((cmp) => cmp.slice(-3) !== ".ts")
  .map((cmp) => {
    const cmpDirPath = path.resolve(allCmpDirPath, cmp);
    return getIndexPathFromDir(cmpDirPath);
  })
  .filter((exist) => exist);

const storeIndexPath = getIndexPathFromDir(path.resolve(srcPath, "store"));
const appIndexPath = getIndexPathFromDir(path.resolve(srcPath, "App"));

const getCssModulesPlugin = () => {
  return cssModulesPlugin({
    // optional. set to false to not inject generated css into page;
    // default value is false when set `v2` to `true`, otherwise default is true,
    // if set to `true`, the generated css will be injected into `head`;
    // could be a string of css selector of the element to inject into,
    // e.g.
    // ```
    // inject: '#some-element-id' // the plugin will try to get `shadowRoot` of the found element, and append css to the `shadowRoot`, if no shadowRoot then append to the found element, if no element found then append to document.head
    // ```
    // could be a function with params content & digest (return a string of js code to inject to page),
    // e.g.
    // ```
    // inject: (cssContent, digest) => `console.log("${cssContent}", "${digest}")`
    // ```
    inject: false,

    localsConvention: "camelCaseOnly", // optional. value could be one of 'camelCaseOnly', 'camelCase', 'dashes', 'dashesOnly', default is 'camelCaseOnly'

    generateScopedName: (name, filename, css) => {
      return "name__filename__css";
    }, // optional. refer to: https://github.com/madyankin/postcss-modules#generating-scoped-names

    filter: /\.modules?\.css$/i, // Optional. Regex to filter certain CSS files.

    cssModulesOption: {
      // optional, refer to: https://github.com/madyankin/postcss-modules/blob/d7cefc427c43bf35f7ebc55e7bda33b4689baf5a/index.d.ts#L27
      // this option will override others passed to postcss-modules
    },

    v2: true, // experimental. v2 can bundle images in css, note if set `v2` to true, other options except `inject` will be ignored. and v2 only works with `bundle: true`.
    v2CssModulesOption: {
      // Optional.
      dashedIndents: false, // Optional. refer to: https://github.com/parcel-bundler/parcel-css/releases/tag/v1.9.0
      /**
       * Optional. The currently supported segments are:
       * [name] - the base name of the CSS file, without the extension
       * [hash] - a hash of the full file path
       * [local] - the original class name
       */
      pattern: `custom-prefix_[local]_[hash]`,
    },
  });
};

const baseConfig = {
  bundle: true,
  tsconfig: "./tsconfig.json",
  plugins: [],
};

const browserConfig = {
  ...baseConfig,
  entryPoints: ["./src/index.tsx", appIndexPath, ...componentsIndexPaths]
    .concat(storeIndexPath)
    .filter((f) => f),
  platform: "browser",
  external: [],
  outdir: "dist/client",
  plugins: [
    ...baseConfig.plugins,
    externalGlobalPlugin({
      react: "window.React",
      process: "window.process",
      "react-dom": "window.ReactDOM",
    }),
  ],
  splitting: true,
  format: "esm",
};

const nodeConfig = {
  ...baseConfig,
  entryPoints: ["./src/main.tsx"],
  platform: "node",
  external: [],
  outdir: "dist/ssr",
  plugins: [...baseConfig.plugins],
};

const main = async () => {
  const cssModule = getCssModulesPlugin();
  const browserResults = await esbuild.build({
    ...browserConfig,
    plugins: [...browserConfig.plugins, cssModule],
  });
  const previousCssModule = getCssModulesPlugin();
  const finalNodeConfig = {
    ...nodeConfig,
    plugins: [...nodeConfig.plugins, previousCssModule],
  };
  const nodeResults = await esbuild.build(finalNodeConfig);
  (() => ({ browserResults, nodeResults }))();
};

main();
