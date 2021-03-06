var webpack = require('webpack');

module.exports = {
    entry : {
        index : './components/Index/router.js'
    },
    output : {
        path : __dirname + '/build',
        filename : 'index.js'
    },
    devServer: {
        contentBase: '',
        historyApiFallback: true,
        inline: true,
        port: '8080'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(png|jpg)$/, loader: "url-loader" },
        ]
    }
}
