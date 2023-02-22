const express = require('express');
const usersRouter = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/users');
const passport = require('passport');

usersRouter.use(bodyParser.json());

/* GET users listing. */
// usersRouter.get('/', async (req, res, next) => {
//   res.send('respond with a resource');
// });

// usersRouter.post('/signup', async (req, res, next) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     if (user != null) {
//       const err = new Error('User ' + req.body.username + ' already exists');
//       err.status = 403;
//       throw err;
//     } else {
//       const newUser = await User.create({
//         username: req.body.username,
//         password: req.body.password,
//       });
//       res.sendStatus(200);
//       res.setHeader('Content-Type', 'application/json');
//       res.json({ status: 'Registration successful', user: newUser });
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// usersRouter.post('/login', async (req, res, next) => {
//   try {
//     if (!req.cookies.user) {
//       const authHeader = req.headers.authorization;
//       if (!authHeader) {
//         const err = new Error('You are not authenticated');
//         res.setHeader('www-Authenticate', 'Basis');
//         err.status = 401;
//         throw err;
//       }
//       const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//       const username = auth[0];
//       const pass = auth[1];
//       const user = await User.findOne({ username: username });
//       if (user == null) {
//         const err = new Error('User ' + username + ' does not exist');
//         err.status = 403;
//         throw err;
//       } else if (user.password != pass) {
//         const err = new Error('Your password is incorrect!');
//         err.status = 403;
//         throw err;
//       } else if (user.username == username && user.password == pass) {
//         req.cookies.user = 'authenticated';
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('You are authenticated!');
//       }
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// usersRouter.get('/logout', async (req, res, next) => {
//   try {
//     if (req.cookies) {
//       req.cookies.destroy();
//       res.clearCookie('cookies-id');
//       res.redirect('/');
//     } else {
//       const err = new Error('You are not logged in!');
//       err.status = 403;
//       throw err;
//     }
//   } catch (err) {
//     next(err);
//   }
// });

usersRouter.post('/signup', (req, res, next) => {
	  User.register(new User({username: req.body.username}), 
	    req.body.password, (err, user) => {
	    if(err) {
	      res.statusCode = 500;
	      res.setHeader('Content-Type', 'application/json');
	      res.json({err: err});
	    }
	    else {
	      passport.authenticate('local')(req, res, () => {
	        res.statusCode = 200;
	        res.setHeader('Content-Type', 'application/json');
	        res.json({success: true, status: 'Registration Successful!'});
	      });
	    }
	  });
	});
	
	usersRouter.post('/login', passport.authenticate('local'), (req, res) => {
	  res.statusCode = 200;
	  res.setHeader('Content-Type', 'application/json');
	  res.json({success: true, status: 'You are successfully logged in!'});
	});
  
module.exports = usersRouter;