const express = require('express');
const bodyParser = require('body-parser');
const Leader = require('../models/leaders');

const leadersRouter = express.Router();

leadersRouter.use(bodyParser.json());

leadersRouter.route('/')
  .get(async (req, res, next) => {
    try {
      const leaders = await Leader.find({});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leaders);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const leaders = await Leader.create(req.body);
      console.log('Dish Created ', leaders);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leaders);
    } catch (err) {
      next(err);
    }
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
  })
  .delete(async (req, res, next) => {
    try {
      const resp = await Leader.remove({});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    } catch (err) {
      next(err);
    }
  });

// Create, Read, Delete => leaders by Id
leadersRouter.route('/:leadersId')
  .get(async (req, res, next) => {
    try {
      const leaders = await Leader.findById(req.params.leadersId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leaders);
    } catch (err) {
      next(err);
    }
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leadersId)
  })
  .put(async (req, res, next) => {
    try {
      const leaders = await Leader.findByIdAndUpdate(req.params.leadersId, { $set: req.body }, { new: true });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leaders);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const resp = await Leader.findByIdAndRemove(req.params.leadersId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    } catch (err) {
      next(err)
    }
  })
  
module.exports = leadersRouter;
