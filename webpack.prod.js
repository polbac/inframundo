const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.mjs', '.js', '.json'], // Add '.mjs' to extensions
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              'corejs': '3',
              'useBuiltIns': 'usage'
            }]
          ],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    },
    {
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    },]
  }
})