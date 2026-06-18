const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, 'tsconfig.json'), []);

module.exports = {
  output: {
    uniqueName: 'angular_remoteapp',
    publicPath: 'auto',
    scriptType: 'text/javascript',
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'angular_remoteapp',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'angular_remoteapp' },
      exposes: {
        './Component': './src/bootstrap.ts',
      },
      shared: mf.share({
        '@angular/core': {
          singleton: true,
          strictVersion: false,
          requiredVersion: 'auto',
          eager: false,
        },
        '@angular/common': {
          singleton: true,
          strictVersion: false,
          requiredVersion: 'auto',
          eager: false,
        },
        '@angular/router': {
          singleton: true,
          strictVersion: false,
          requiredVersion: 'auto',
          eager: false,
        },
        '@angular/platform-browser': {
          singleton: true,
          strictVersion: false,
          requiredVersion: 'auto',
          eager: false,
        },
        ...sharedMappings.getDescriptors(),
      }),
    }),
    sharedMappings.getPlugin(),
  ],
};
