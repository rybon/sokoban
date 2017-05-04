// Package config
const config = require('./package').config;
// User config
const argv = require('minimist')(process.argv.slice(2));
const host = (argv && argv.host) || '';
const port = (argv && argv.port) || config.port || 80;
// Webpack
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const WebpackDevServer = require('webpack-dev-server');
// Proxy
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const proxyPort = port + 1;
// API
const fs = require('fs');
const path = require('path');
const levels = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'api', 'levels.json')));
const scores = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'api', 'scores.json')));

app.get('/api/levels/:id', (request, response) => {
    setTimeout(() => {
        response.json(levels[request.params.id]);
    }, 1000);
});
app.get('/api/scores', (request, response) => {
    setTimeout(() => {
        response.json(scores);
    }, 1000);
});
app.post('/api/scores', (request, response) => {
    setTimeout(() => {
        fs.writeFileSync(path.resolve(__dirname, 'api', 'scores.json'), JSON.stringify(request.body, null, 4));
        response.json({ status: 'Scores saved.' });
    }, 1000);
});
app.listen(proxyPort);

// Fixes for HMR
webpackConfig.output.publicPath = 'http://' + (host ? host : 'localhost') + ':' + port + '/';
webpackConfig.entry[0] = webpackConfig.entry[0].replace('localhost', (host ? host : 'localhost') + ':' + port);

new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
        colors: true
    },
    proxy: {
        '/api/*': {
            target: 'http://' + (host || 'localhost') + ':' + proxyPort
        }
    }
}).listen(port, host, (error) => {
    if (error) {
        console.log(error); // eslint-disable-line no-console
        return;
    }

    console.log('Listening at http://' + (host || 'localhost') + ':' + port); // eslint-disable-line no-console
});
