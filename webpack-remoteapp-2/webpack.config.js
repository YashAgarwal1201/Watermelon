// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader"); // ADD THIS IMPORT
const {
  container: { ModuleFederationPlugin },
} = require("webpack");
const dependencies = require("./package.json").dependencies || {};
require("dotenv").config();

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  // safe env injection (only strings)
  const envKeys = {
    "process.env": Object.keys(process.env).reduce((acc, key) => {
      acc[key] = JSON.stringify(process.env[key]);
      return acc;
    }, {}),
  };

  return {
    entry: "./src/main.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isDevelopment ? "[name].js" : "[name].[contenthash].js",
      publicPath: "auto", // important for Module Federation remote
      clean: true,
    },
    mode: isDevelopment ? "development" : "production",
    devtool: isDevelopment ? "eval-source-map" : "source-map",
    module: {
      rules: [
        // Vue single-file components
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },

        // TypeScript
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
            },
          },
        },

        // CSS modules (scss)
        {
          test: /\.module\.(scss|sass|css)$/,
          use: [
            isDevelopment ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isDevelopment
                    ? "[local]__[hash:base64:6]"
                    : "[hash:base64:6]",
                },
                importLoaders: 2,
                sourceMap: isDevelopment,
              },
            },
            "postcss-loader",
            "sass-loader",
          ],
        },

        // global styles
        {
          test: /\.(scss|sass|css)$/,
          exclude: /\.module\.(scss|sass|css)$/,
          use: [
            isDevelopment ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: false, // Explicitly disable modules for global styles
                sourceMap: isDevelopment,
                importLoaders: 2,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: isDevelopment,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: isDevelopment,
              },
            },
          ],
        },

        // assets
        {
          test: /\.(png|jpe?g|gif|webp|avif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(svg)$/i,
          type: "asset",
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js", ".vue", ".json"],
      alias: {
        "@": path.resolve(__dirname, "src"),
        // DO NOT alias "vue" to runtime-dom here — let Webpack/ModuleFederation resolve "vue".
      },
    },
    plugins: [
      new VueLoaderPlugin(), // ADD THIS PLUGIN

      new ModuleFederationPlugin({
        name: "remoteapp2",
        filename: "remoteEntry.js",
        exposes: {
          // exposes whole app via bootstrap mount/unmount
          "./app": "./src/bootstrap.ts",
        },
        // share only essential packages explicitly (avoid spreading all dependencies)
        shared: {
          vue: {
            import: "vue",
            singleton: true,
            requiredVersion: dependencies.vue || false,
            eager: false, // MUST be false for correct MF behavior
          },
          // share other libs if you use them and want host/remote singletons:
          // "vue-router": {
          //   import: "vue-router",
          //   singleton: true,
          //   requiredVersion: dependencies["vue-router"] || false,
          //   eager: false,
          // },
          // Add other shared libs here as needed (pin strictVersion if desired)
        },
        // use the default share scope
        // shareScope: "default"  // optional, default is fine
      }),

      new HtmlWebpackPlugin({
        template: "./index.html",
        inject: "body",
      }),

      new MiniCssExtractPlugin({
        filename: isDevelopment ? "[name].css" : "[name].[contenthash].css",
        chunkFilename: isDevelopment ? "[id].css" : "[id].[contenthash].css",
      }),

      new webpack.DefinePlugin({
        ...envKeys,
        __VUE_OPTIONS_API__: JSON.stringify(false),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        name: false,
      },
      runtimeChunk: "single",
    },
    devServer: isDevelopment
      ? {
          port: 5162,
          hot: true,
          open: false,
          historyApiFallback: {
            disableDotRule: true,
            index: "/",
            rewrites: [{ from: /.*/, to: "/index.html" }],
          },
          static: {
            directory: path.join(__dirname, "public"),
            publicPath: "/",
          },
          headers: {
            "Access-Control-Allow-Origin": "*", // allow hosts to load this remote
            "Access-Control-Allow-Methods":
              "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers":
              "X-Requested-With, content-type, Authorization",
          },
          // if you need HTTPS local dev, configure certs here (optional)
          // server: {
          //   type: "https",
          //   options: {
          //     key: path.resolve(__dirname, "dev-key.pem"),
          //     cert: path.resolve(__dirname, "dev-cert.pem"),
          //   },
          // },
          allowedHosts: "all",
        }
      : {
          // production-like static server for preview
          port: 5162,
          static: {
            directory: path.join(__dirname, "public"),
            publicPath: "/",
          },
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers":
              "X-Requested-With, content-type, Authorization",
          },
          allowedHosts: "all",
        },
    performance: {
      hints: false,
    },
  };
};
