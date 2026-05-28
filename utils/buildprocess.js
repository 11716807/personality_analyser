console.log('\n=== Build Process Started ===');
console.log('BABEL_ENV:', process.env.BABEL_ENV);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ASSET_PATH:', process.env.ASSET_PATH);
console.log('RELEASE:', process.env.RELEASE);

try {
  console.log('Loading dependencies...');
  var webpack = require('webpack');
  var path = require('path');
  var fs = require('fs');
  var config = require('../webpack.config');
  var ZipPlugin = require('zip-webpack-plugin');
  console.log('Dependencies loaded successfully');

  console.log('\n=== Webpack Configuration ===');
  console.log('Mode:', config.mode);
  console.log('Entry Points:', Object.keys(config.entry));

  delete config.chromeExtensionBoilerplate;

  var packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  console.log('\n=== Package Info ===');
  console.log('Package Name:', packageInfo.name);
  console.log('Package Version:', packageInfo.version);

  var releaseStamp = process.env.RELEASE_STAMP || 'snapshot';
  console.log('Release Stamp:', releaseStamp);

  config.plugins = (config.plugins || []).concat(
    new ZipPlugin({
      filename: `${packageInfo.name}-${packageInfo.version}-${releaseStamp}.zip`,
      path: path.join(__dirname, '../', 'zip'),
    })
  );

  console.log('\n=== Build Output ===');
  console.log('Zip Output Path:', path.join(__dirname, '../', 'zip'));
  console.log('Zip Filename:', `${packageInfo.name}-${packageInfo.version}-${releaseStamp}.zip`);

  console.log('\n=== Starting Webpack Compilation ===');

  const compiler = webpack(config);

  compiler.run((err, stats) => {
    if (err) {
      console.error('Webpack compilation error:', err);
      process.exit(1);
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error('Build failed with errors:');
      info.errors.forEach(error => console.error(error));
      process.exit(1);
    }

    if (stats.hasWarnings()) {
      console.warn('Build has warnings:');
      info.warnings.forEach(warning => console.warn(warning));
    }

    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }));

    console.log('\nBuild completed successfully!');
    compiler.close((closeErr) => {
      if (closeErr) {
        console.error('Error closing compiler:', closeErr);
        process.exit(1);
      }
      process.exit(0);
    });
  });

} catch (error) {
  console.error('\n=== Build Error ===');
  console.error(error);
  process.exit(1);
}
