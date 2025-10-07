// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    target: "web",
    entry: path.resolve(__dirname, "src", "index.tsx"),
    devtool: isProduction ? "source-map" : "inline-source-map",

    devServer: {
      port: 5161,
      hot: true,
      open: true,
      historyApiFallback: true,
      compress: true,
      client: {
        overlay: false, // This fixes the overlay error
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
      // publicPath: isProduction ? "/static/" : "/",
      libraryExport: "main",
      publicPath: "auto",
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".scss", ".css"],
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@/components": path.resolve(__dirname, "src/components"),
        react: path.resolve("./node_modules/react"),
        "react-dom": path.resolve("./node_modules/react-dom"),
      },
    },

    module: {
      rules: [
        // Typescript
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        },

        // Babel for JS/JSX (optional but kept from your original)
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        },

        // CSS (including Tailwind v4)
        {
          test: /\.css$/i,
          exclude: /\.module\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: "postcss-loader",
            },
          ],
        },

        // CSS Modules
        {
          test: /\.module\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                },
                importLoaders: 1,
              },
            },
            {
              loader: "postcss-loader",
            },
          ],
        },

        // SCSS Modules
        {
          test: /\.module\.(scss|sass)$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                },
                importLoaders: 2,
              },
            },
            {
              loader: "postcss-loader",
            },
            "sass-loader",
          ],
        },

        // Global SCSS
        {
          test: /\.(scss|sass)$/,
          exclude: /\.module\.(scss|sass)$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
              },
            },
            {
              loader: "postcss-loader",
            },
            "sass-loader",
          ],
        },

        {
          test: /\.module\.s[ac]ss$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                },
              },
            },
            "sass-loader",
          ],
        },

        // Assets
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },

    // externals: {
    //   react: "react",
    //   "react-dom": "react-dom",
    // },

    plugins: [
      new CleanWebpackPlugin(),

      // Module Federation
      new webpack.container.ModuleFederationPlugin({
        name: "webpack_react_remoteapp",
        filename: "remoteEntry.js",
        runtime: false,
        exposes: {
          "./WebpackReactRemoteComponent": "./src/App.tsx",
        },
        // shared: {
        //   react: { singleton: true, requiredVersion: "^18.0.0", eager: true },
        //   "react-dom": {
        //     singleton: true,
        //     requiredVersion: "^18.0.0",
        //     eager: true,
        //   },
        // },
        shared: {
          react: {
            singleton: true,
            requiredVersion: "^19.1.1", // Match host version
            eager: false,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: "^19.1.1", // Match host version
            eager: false,
          },
        },
      }),

      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "React Remote App",
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

      // Extract CSS files in production
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "[name].[contenthash].css",
              chunkFilename: "[id].[contenthash].css",
            }),
          ]
        : []),
    ],

    optimization: {
      // splitChunks: {
      //   chunks: "all",
      // },
      runtimeChunk: false,
      splitChunks: {
        // Only split async chunks, not all chunks
        chunks: "async",
      },
    },

    performance: {
      hints: isProduction ? "warning" : false,
    },
  };
};
