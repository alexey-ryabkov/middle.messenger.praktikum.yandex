/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV;
const isProdMode = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

module.exports = {
    mode: mode || 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `bundle${!isProdMode ? '-[hash]' : ''}.js`,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            'handlebars' : 'handlebars/dist/handlebars.js'
        },
        plugins: [
            new TsconfigPathsPlugin(),
        ],
    },
    devtool: !isProdMode ? 'source-map' : false,
    devServer: {
        port: 1234,
        hot: !isProdMode,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin(
        {
            template: './src/index.html',
            minify: {
                removeComments: isProdMode,
                collapseWhitespace: isProdMode
            },
            inject: 'body'
        }),
        new MiniCssExtractPlugin(
        {
            filename: `bundle${!isProdMode ? '-[hash]' : ''}.css`,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [ 'ts-loader' ],
                exclude: '/node_modules/',
            },
            {
                test: /\.scss$/i,
                use: [
                    stylesHandler,
                    'css-loader',   
                    'sass-loader',                                    
                ],
            },
            {
                test: /\.(?:woff(2)?|eot|ttf|otf|svg|ico|gif|png|jpg|jpeg)$/i,
                type: 'asset',
            },
        ]
    }
}; 
