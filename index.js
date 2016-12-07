'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');

const app = express();
const api = require('./api');

const port = process.env.PORT || 3000;

app.use(compress());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api', api);

app.listen(port, function () {
    console.log(`Running on port ${port}`);
});