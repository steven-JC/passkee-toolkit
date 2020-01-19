require('colors')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

process.env.BABEL_ENV = 'gui'

module.exports = {
    mode: isProd ? 'production' : 'development',
    entry: {
        index: path.join(__dirname, '../src/index.ts')
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        path: path.join(__dirname, '../dist'),
        publicPath: '',
        filename: `[name].js`,
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    plugins: [
        new CopyWebpackPlugin([
            {
                context: 'tmp',
                from: '**/*.d.ts',
                to: 'types/',
                force: true
            }
        ])
    ],

    resolve: {
        alias: {
            '@': path.join(__dirname, '../src')
        },
        extensions: ['.js', '.ts', '.json']
    },

    devtool: isProd ? false : '#cheap-module-eval-source-map',
    target: 'node'
}
