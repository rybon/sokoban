const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
// Webpack
const webpack = require('webpack');
const webpackConfig = require('./webpack.production.config');

const compiler = webpack(webpackConfig);

const indexPath = path.resolve(__dirname, 'index.html');
const outputIndexPath = path.resolve(__dirname, 'dist/index.html');
const outputStylesPath = path.resolve(__dirname, 'dist/styles.css');
const outputScriptsPath = path.resolve(__dirname, 'dist/scripts.js');
if (fs.existsSync(outputIndexPath)) {
    fs.unlinkSync(outputIndexPath);
}
if (fs.existsSync(outputStylesPath)) {
    fs.unlinkSync(outputStylesPath);
}
if (fs.existsSync(outputScriptsPath)) {
    fs.unlinkSync(outputScriptsPath);
}

compiler.run((error, stats) => {
    if (error) {
        console.error('Build failed!\n'); // eslint-disable-line no-console
        console.log(stats.toJson()); // eslint-disable-line no-console
        return;
    }

    if (fs.existsSync(indexPath) && fs.existsSync(outputStylesPath) && fs.existsSync(outputScriptsPath)) {
        const $ = cheerio.load(fs.readFileSync(indexPath));
        $('head').append($('    <link rel="stylesheet" type="text/css" href="styles.css">\n    '));
        fs.writeFileSync(outputIndexPath, $.html());
    }

    console.info('Build succeeded!\n'); // eslint-disable-line no-console
});
