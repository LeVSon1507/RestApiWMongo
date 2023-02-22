const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');

const promotionsRouter = express.Router();

promotionsRouter.use(bodyParser.json());

promotionsRouter.route('/')
  .get(async (req, res, next) => {
    try {
      const promotions = await Promotions.find({});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotions);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const promotions = await Promotions.create(req.body);
      console.log('Dish Created ', promotions);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotions);
    } catch (err) {
      next(err);
    }
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete(async (req, res, next) => {
    try {
      const resp = await Promotions.remove({});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    } catch (err) {
      next(err);
    }
  });

// Create, Read, Delete => promotions by Id
promotionsRouter.route('/:promotionsId')
  .get(async (req, res, next) => {
    try {
      const promotions = await Promotions.findById(req.params.promotionsId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotions);
    } catch (err) {
      next(err);
    }
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promotionsId)
  })
  .put(async (req, res, next) => {
    try {
      const promotions = await Promotions.findByIdAndUpdate(req.params.promotionsId, { $set: req.body }, { new: true });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotions);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const resp = await Promotions.findByIdAndRemove(req.params.promotionsId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    } catch (err) {
      next(err)
    }
  })
  
module.exports = promotionsRouter;
