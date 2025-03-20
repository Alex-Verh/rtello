const { context } = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin');

(async () => {
  const ctx = await context({
    entryPoints: [
      'app/javascript/application.ts',
      'app/javascript/pages/*.ts',
    ],
    bundle: true,
    outdir: 'app/assets/builds',
    publicPath: '/assets',
    plugins: [
      sassPlugin.sassPlugin(),
    ],
    loader: {
      '.css': 'css',
    },
  });

  await ctx.watch(); // Enable watch mode
  console.log('Watching for changes...');
})().catch(() => process.exit(1));