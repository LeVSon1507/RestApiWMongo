const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = express.Router();

indexRouter.use(bodyParser.json());

indexRouter.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})



module.exports = indexRouter;