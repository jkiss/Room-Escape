/*
 * @Author: Nokey
 * @Date: 2017-02-24 14:16:31
 * @Last Modified by: Nokey
 * @Last Modified time: 2017-09-02 20:45:03
 */
'use strict';

const webpack = require('webpack')
const path = require('path')
const config = require('./config')

/**
 * Common config that can be used in dev & prod environment
 */
const ENTRY = require('./webpack/entry')
const LOADERS = require('./webpack/loaders').loaders
const PLUGINS = require('./webpack/plugins').plugins
const RESOLVE = require('./webpack/resolve')

/**
 * Config
 */
const PORT = 8989
const PUBLIC_PATH = config.public_path

/**
 * Dev plugins
 */
const openBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    // dectool should be false if env is production!!!
    devtool: 'cheap-eval-source-map', // false || 'cheap-eval-source-map'

    // devServer
    devServer: {
        port: PORT,
        contentBase: path.join(__dirname, './build')
    },

    entry: ENTRY,

    output: {
        path: path.join(__dirname, "build"),
        filename: "bundle/[name].js",
        publicPath: PUBLIC_PATH
    },

    module: {
        loaders: LOADERS.concat([
            {
                test: /\.(gif|png|jpg|cur)\??.*$/,
                use: [
                    {
                        loader: 'url-loader',
                        options:{
                            limit: 1024,
                            name: 'images/[hash].[ext]'
                        }
                    }
                ]
            },
    
            {
                test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                use: [
                    {
                        loader: 'url-loader',
                        options:{
                            limit: 1024,
                            name: 'fonts/[name].[ext]'
                        }
                    }
                ]
            }

            ,{
                test: /\.(mp3|mp4)\??.*$/,
                use: [
                    {
                        loader: 'file-loader',
                        options:{
                            name: 'sounds/[name].[ext]'
                        }
                    }
                ]
            }
        ])
    },

    plugins: PLUGINS.concat([
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development') // development - production
            }
        })

        // It's not necessary to open broswer everytime after bundle
        // ,new openBrowserPlugin({
        //     url: 'http://localhost:' + PORT + PUBLIC_PATH
        // })
    ]),

    resolve: RESOLVE
};