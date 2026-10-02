// SVGR config for `npm run icons`: src/components/icons/svg/*.svg
// -> typed React components in src/components/icons/generated/.
module.exports = {
  typescript: true,
  jsxRuntime: "automatic",
  // width/height = 1em: icons size with font-size, or override with size-* classes.
  icon: true,
  // Decorative by default; give the parent control an accessible name instead.
  svgProps: { "aria-hidden": "true", focusable: "false" },
  filenameCase: "kebab",
  prettier: false, // formatted by Biome in the npm script
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: { overrides: { removeViewBox: false, convertColors: false } },
      },
    ],
  },
  indexTemplate: require("./scripts/svgr-index-template.cjs"),
};
