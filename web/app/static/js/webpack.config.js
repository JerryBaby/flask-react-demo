var webpack = require('webpack');

module.exports = {
    entry : {
        //index: './components/login.js'
        //index: './components/register.js'
        //index : './components/Dashboard/index.js'
        index : './components/Servers/index.js'
        //index : './components/Users/index.js'
        //index : './components/CMDB/index.js'
    },
    output : {
        path : __dirname + '/build',
        //filename: 'login.js'
        //filename: 'register.js'
        //filename : 'index.js'
        filename : 'servers.js'
        //filename : 'users.js'
        //filename : 'cmdb.js'
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
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
}
}
