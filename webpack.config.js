const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const NODE_ENV = process.env.NODE_ENV;
process.env.BABEL_ENV = NODE_ENV;

const IS_PRODUCTION = NODE_ENV === 'production';

const clientPath = path.resolve(__dirname, './src');
const assetsPath = function (_path) {
    return path.posix.join('static', _path);
};

let pages = ['index'];

let config = {
    node: {
        fs: 'empty'
    },
    entry: getEntry(),
    output: getOutput(),
    devtool: getDevtool(),
    plugins: getPlugins(),
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            '@': clientPath
        }
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            },

            {
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        include: path.resolve(__dirname, './src'),
                        loader: require.resolve('babel-loader'),
                        options: {
                            babelrc: false,
                            presets: [require.resolve('babel-preset-react-app')],
                            compact: true
                        },
                    },
                ]
            },

            {
                test: /(\.css|\.scss)$/,
                use: getCssLoaders('style-loader')
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('img/[name].[hash:7].[ext]'),
                    publicPath: IS_PRODUCTION ? 'assets/' : ''
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('media/[name].[hash:7].[ext]'),
                    publicPath: IS_PRODUCTION ? 'assets/' : ''
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('fonts/[name].[hash:7].[ext]'),
                    publicPath: IS_PRODUCTION ? 'assets/' : ''
                }
            }
        ],
    }
};

if (IS_PRODUCTION) {
    // config.target = 'electron-renderer';
}

function getEntry() {
    let entry = {
        'vendor': [
            'react',
            'react-dom',
            'react-motion',
        ]
    };
    pages.forEach(page => {
        let url = './src/main.js';
        if (IS_PRODUCTION) {
            entry[page] = url;
        }
        else {
            entry[page] = [url];
        }
    });

    return entry;
}

function getOutput() {
    if (IS_PRODUCTION) {
        return {
            path: path.resolve(__dirname, './build', 'assets'),
            filename: '[name].[chunkhash:6].js',
            // chunkFilename: '[id].[chunkhash].js'
        };
    }
    else {
        return {
            path: '/',
            filename: '[name].js'
        };
    }
}

function getDevtool() {
    return IS_PRODUCTION ? 'cheap-module-source-map' : 'eval-source-map';
}

function getPlugins() {
    let plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV)
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ];
    if (IS_PRODUCTION) {
        plugins = plugins.concat([
            new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                comments: false,
                sourceMap: true,
                compress: {
                    unused: true,
                    dead_code: true, // big one--strip code that will never execute
                    warnings: false, // good for prod apps so users can't peek behind curtain
                    drop_debugger: true,
                    conditionals: true,
                    evaluate: true,
                    drop_console: true, // strips console statements
                    sequences: true,
                    booleans: true,
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: ['vendor', 'manifest'],
                path: path.resolve(__dirname, './build', 'assets'),
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    safe: true
                }
            }),
            new ExtractTextPlugin('[name].[chunkhash:6].css')
        ]);
    }
    else {
        plugins = plugins.concat([
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ]);
    }
    pages.forEach(page => {
        plugins.push(new HtmlWebpackPlugin({
            chunks: [page, 'vendor', 'manifest'],
            filename: `../${page}.html`,
            template: './src/template.ejs',
            inject: false
        }));
    });
    return plugins;
}

function getCssLoaders(fallback) {
    // sass & css
    let use = [
        {
            loader: 'css-loader',
            options: {
                sourceMap: true,
                minimize: true
            },

        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                plugins: [
                    autoprefixer, cssnano({
                        discardComments: { removeAll: true },
                        reduceIdents: false
                    })
                ]
            }
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true
            }
        }
    ];
    if (IS_PRODUCTION) {
        return ExtractTextPlugin.extract({
            fallback: fallback,
            use: use
        });
    } else {
        return [{
            loader: fallback
        }].concat(use);
    }
}

module.exports = config;