const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    target: "web",
    entry: "./src/main.ts",
    devtool: isProduction ? "source-map" : "inline-source-map",

    devServer: {
      port: 5162,
      hot: true,
      open: true,
      liveReload: true,

      historyApiFallback: true,
      compress: true,
      client: {
        overlay: false, // Disable overlay for federation compatibility
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
      static: {
        directory: path.join(__dirname, "public"),
      },
    },

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash].js" : "[name].js",
      clean: true,
      libraryExport: "main",
      publicPath: "auto",
      // Add these for Module Federation CSS modules
      chunkLoadingGlobal: "webpackChunkwebpack_vue_remoteapp",
      uniqueName: "webpack_vue_remoteapp",
    },

    optimization: {
      splitChunks: false, //{
      //   // Only split async chunks, not all chunks
      //   chunks: "async",
      // }, // Disable for Module Federation
      runtimeChunk: false,
    },

    resolve: {
      extensions: [".ts", ".js", ".vue", ".json"],
      alias: {
        "@": path.resolve(__dirname, "src"),
        // Add Vue aliasing to prevent multiple instances
        vue: path.resolve("./node_modules/vue"),
      },
    },

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

        // CSS MODULES FIRST - this is crucial
        {
          test: /\.module\.(scss|sass|css)$/,
          use: [
            {
              loader: "vue-style-loader",
              options: { sourceMap: false, shadowMode: false },
            },
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  exportLocalsConvention: "camelCase",
                },
                importLoaders: 1,
                sourceMap: false,
              },
            },
            "sass-loader",
          ],
        },

        // THEN global styles
        {
          test: /\.(scss|sass|css)$/,
          exclude: /\.module\.(scss|sass|css)$/,
          use: ["vue-style-loader", "css-loader", "sass-loader"],
        },

        // Assets (unchanged)
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

    plugins: [
      new VueLoaderPlugin(),

      // Module Federation Plugin
      new webpack.container.ModuleFederationPlugin({
        name: "webpack_vue_remoteapp",
        filename: "remoteEntry.js",
        runtime: false,
        exposes: {
          "./WebpackVueRemoteComponent": "./src/bootstrap.ts", // or your main component
        },
        shared: {
          vue: {
            singleton: true,
            requiredVersion: "^3.5.0", // Match your Vue version
            eager: false,
          },
        },
      }),

      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "Vue Remote App",
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          : false,
      }),

      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(false),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),

        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // This fixes the warning
      }),

      // Only use MiniCssExtractPlugin in production (commented out for federation)
      // ...(isProduction
      //   ? [
      //       new MiniCssExtractPlugin({
      //         filename: "[name].[contenthash].css",
      //         chunkFilename: "[id].[contenthash].css",
      //       }),
      //     ]
      //   : []),
    ],

    performance: {
      hints: isProduction ? "warning" : false,
    },
  };
};
