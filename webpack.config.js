/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const {merge} = require('webpack-merge');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonConfig = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
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
                    MiniCssExtractPlugin.loader,
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
module.exports = (env, argv) => 
{
    const config = require(`./config/webpack.${ env.WEBPACK_SERVE ? 'development' : argv.mode }`);

    return merge(commonConfig, config); 
};
