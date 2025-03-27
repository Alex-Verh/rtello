const { context } = require("esbuild");
const sassPlugin = require("esbuild-sass-plugin");

(async () => {
  const ctx = await context({
    entryPoints: [
      "app/javascript/application.ts",
      ...glob.sync("app/javascript/controllers/**/*.ts"), // Match all .ts files recursively
    ],
    bundle: true,
    outdir: "app/assets/builds",
    publicPath: "/assets",
    plugins: [sassPlugin.sassPlugin()],
    loader: {
      ".css": "css",
      ".svg": "file",
    },
    external: ["*.woff", "*.woff2"],
  });

  await ctx.watch(); // Enable watch mode
  console.log("Watching for changes...");
})().catch(() => process.exit(1));
