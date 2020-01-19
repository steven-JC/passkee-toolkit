require('colors')
const path = require('path')
const webpack = require('webpack')
const config = require('./webpack.config')
const child_process = require('child_process')

process.env.NODE_ENV = 'production'

console.log(`正在构建项目`)
webpack(config, function(err, stats) {
    if (!err) {
        console.log(`成功构建`.green)
    } else {
        throw err
    }
    child_process.exec(`rm -rf ${path.join(__dirname, '../tmp')}`)
})
