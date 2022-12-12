/* eslint-disable @typescript-eslint/no-var-requires */
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    output: {
        filename: `bundle.js`,
    },
    devtool: 'source-map',
    devServer: {
        port: 1234,
        hot: true,
        compress: false,
        open: 'chrome'
    },
    plugins: [
        new HTMLWebpackPlugin({ template: './src/index.html' }),
        new MiniCssExtractPlugin({ filename: `bundle.css` }),
    ],
}; 
