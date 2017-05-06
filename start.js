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
// WS
require('express-ws')(app);
// Recorder
const slug = require('slug');
const recordingsPath = path.resolve(__dirname, 'recordings');
let recording = {};

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
app.ws('/recorder', (ws, request) => {
    ws.on('message', (message) => {
        const payload = JSON.parse(message);
        if (payload.startRecording) {
            console.log('Started recording!'); // eslint-disable-line no-console
            recording.initialState = payload.initialState;
        } else if (payload.stopRecording) {
            if (!fs.existsSync(recordingsPath)) {
                fs.mkdirSync(recordingsPath);
            }
            const name = slug(payload.name || Date.now());
            const recordingFolderPath = path.resolve(__dirname, 'recordings', name);
            if (!fs.existsSync(recordingFolderPath)) {
                fs.mkdirSync(recordingFolderPath);
            }
            fs.writeFileSync(path.resolve(__dirname, 'recordings', name, 'recording.json'), JSON.stringify(recording, null, 4));
            recording = {};
            console.log('Stopped recording, saved ' + name + '!'); // eslint-disable-line no-console
        } else if (payload.type) {
            if (!recording.dispatches) {
                recording.dispatches = [];
            }
            recording.dispatches.push(payload);
        }
    });
});
app.ws('/replayer', (ws, request) => {
    ws.on('message', (message) => {
        const payload = JSON.parse(message);
        if (payload.startReplaying) {
            if (fs.existsSync(path.resolve(__dirname, 'recordings', payload.name))) {
                console.log('Started replaying!'); // eslint-disable-line no-console
                const recording = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'recordings', payload.name, 'recording.json')));
                ws.send(JSON.stringify({ initialState: recording.initialState }, null, 4));
                if (recording.dispatches && recording.dispatches.length) {
                    let index = 0;
                    const remoteDispatcher = () => {
                        setTimeout(() => {
                            if ((index + 1) !== recording.dispatches.length) {
                                ws.send(JSON.stringify(recording.dispatches[index], null, 4));
                                index = index + 1;
                                remoteDispatcher();
                            } else {
                                ws.send(JSON.stringify({ done: true }, null, 4));
                            }
                        }, 1000);
                    };
                    remoteDispatcher();
                }
            }
        } else if (payload.stopReplaying) {
            console.log('Stopped replaying!'); // eslint-disable-line no-console
        }
    });
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
        },
        '/recorder': {
            target: 'http://' + (host || 'localhost') + ':' + proxyPort,
            ws: true
        },
        '/replayer': {
            target: 'http://' + (host || 'localhost') + ':' + proxyPort,
            ws: true
        }
    }
}).listen(port, host, (error) => {
    if (error) {
        console.log(error); // eslint-disable-line no-console
        return;
    }

    console.log('Listening at http://' + (host || 'localhost') + ':' + port); // eslint-disable-line no-console
});
