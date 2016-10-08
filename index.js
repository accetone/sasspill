const Promise = require('bluebird');
const sass = Promise.promisifyAll(require('node-sass'));
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/test', (req, res) => {
    sass.renderAsync({
        data: '@import "bourbon"; body { @include transform(translateX(50%)); }',
        includePaths: require("bourbon").includePaths
    }).then((result) => {
        res.end(result.css);
    });
});

app.listen(port, function () {
    console.log('Running on localhost:3000');
});