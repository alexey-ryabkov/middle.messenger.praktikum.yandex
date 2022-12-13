/* eslint-disable @typescript-eslint/no-var-requires */
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'production',
    output: {
        filename: 'bundle-[hash].js',
    },
    devtool: false,
    optimization: {
        minimizer: [
            new TerserPlugin(),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin(
        {
            template: './src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            inject: 'body'
        }),
        new MiniCssExtractPlugin({ filename: 'bundle-[hash].css' }),
    ],
}; 
