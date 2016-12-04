'use strict';

const Promise = require('bluebird');
const sass = Promise.promisifyAll(require('node-sass'));
const Joi = Promise.promisifyAll(require('joi'));
const express = require('express');

const router = express.Router();

const compileSchema = Joi.object().keys({
    files: Joi.object().required().keys({
        main: Joi.string().required()
    }),
    libs: Joi.object().required().keys({
        bourbon: Joi.boolean().required()
    }),
    transform: Joi.object().keys({
        minify: Joi.boolean(),
        sourcemap: Joi.boolean()
    })
});

const errorHandler = (res) => {
    return (error) => {
        res.status(500);

        if (error.details) {
            res.json({ message: error.details[0].message })
        }
        else if (error.cause) {
            res.json({ message: error.cause.message });
        }
        else {
            res.json(error.message);
        }
    };
};

const validate = (req, res, next) => {
    Joi.validateAsync(req.body, compileSchema, { allowUnknown: true })
        .then(() => next())
        .catch(errorHandler(res));
};

const preprocess = (req, res, next) => {
    let code = req.body.files.main;

    code.split('@import')
        .forEach((i) => {
            let separatorIndex = i.indexOf(';');

            let replace = '@import' + i.substr(0, separatorIndex + 1);
            let name = i[0] === ' '
                ? i.substr(2, separatorIndex - 3)
                : i.substr(1, separatorIndex - 2);

            if (!req.body.files[name]) return;

            code = code.replace(replace, req.body.files[name]);
        });

    if (req.body.libs.bourbon) {
        code = '@import "bourbon";\n' + code;
    }

    req.compileOptions = {
        data: code,
        includePaths: require("bourbon").includePaths,
        outputStyle: req.body.transform && req.body.transform.minify ? 'compressed' : 'nested',
        sourceMap: req.body.transform && req.body.transform.sourcemap,
        outFile: 'main.css'
    };

    next();
};

const compile = (req, res, next) => {
    sass.renderAsync(req.compileOptions).then((result) => {
        req.result = {
            css: result.css.toString(),
            map: result.map ? result.map.toString() : undefined
        };

        next();
    }).catch(errorHandler(res));
};

const respond = (req, res) => {
    res.json(req.result);
};

router.post('/', validate);
router.post('/', preprocess);
router.post('/', compile);
router.post('/', respond);

module.exports = router;