'use strict';

const express = require('express');
const router = express.Router();

const scssController = require('./scssController');

router.use('/scss', scssController);

module.exports = router;



