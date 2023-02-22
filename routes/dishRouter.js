const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// Create, Read, Delete => dish
dishRouter.route('/')
  .get(async (req, res, next) => {
    try {
      const dishes = await Dishes.find({});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const dish = await Dishes.create(req.body);
      console.log('Dish Created ', dish);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    } catch (err) {
      next(err);
    }
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
  })
  .delete(async (req, res, next) => {
    try {
      const resp = await Dishes.remove({});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    } catch (err) {
      next(err);
    }
  });

// Create, Read, Delete => dish by Id
dishRouter.route('/:dishId')
  .get(async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    } catch (err) {
      next(err);
    }
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId)
  })
  .put(async (req, res, next) => {
    try {
      const dish = await Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const resp = await Dishes.findByIdAndRemove(req.params.dishId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    } catch (err) {
      next(err)
    }
  })

// Create, Read, Delete => dish by Id/comments
dishRouter.route('/:dishId/comments')
  .get(async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      if (dish != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments);
      } else {
        err = new Error('Dish' + req.params.dishId + 'not found')
        err.status = 404;
        return next(err)
      }
    } catch (err) {
      next(err);
    }
  })

  .post(async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      if (dish != null) {
        dish.comments.push(req.body)
        dish.save()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      } else {
        err = new Error('Dish' + req.params.dishId + 'not found')
        err.status = 404;
        return next(err)
      }
    } catch (err) {
      next(err);
    }
  })

  .put(async (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments')
  })

  .delete(async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      if (dish != null) {
        for (let i = (dish.comments.length - 1); i >= 0; i--) {
          dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      } else {
        err = new Error('Dish' + req.params.dishId + 'not found')
        err.status = 404;
        return next(err)
      }
    } catch (err) {
      next(err);
    }
  })

//=======/:dishId/comments/:commentId====//
dishRouter.route('/:dishId/comments/:commentId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments.id(req.params.commentId));
        } else if (!dish) {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`);
  })

  .put((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentId)) {
          if (req.body.rating) {
            dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
            dish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          dish.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish);
            })
            .catch((err) => next(err));
        } else if (!dish) {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish && dish.comments.id(req.params.commentId)) {
          dish.comments.id(req.params.commentId).remove();
          dish.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish);
            })
            .catch((err) => next(err));
        } else if (!dish) {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });


module.exports = dishRouter;