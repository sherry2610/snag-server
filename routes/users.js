var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();


const authenticate = require('../authenticate');
var User = require('../models/user');
var passport = require('passport');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => { //{ username, password }
  if (!req.body.username) {
		res.send("Body doesn't contain username!");
	}
	if (!req.body.password) {
		res.send("Body doesn't contain password!");
  }
  passport.authenticate('local', (err, user, info) => {
		if (err)
			return next(err);

		if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: false, status: 'Login Failed', err: info});		
		}
		req.logIn(user, (err) => {
			if (err) {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				res.json({success: false, status: 'Login Failed', err: 'Could not log in user!'});
			}
			
			var token = authenticate.getToken({_id: req.user._id});

			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: true, user: user, token: token, status: 'Login Successful!'});
	});
	})(req, res, next);
})

router.post('/signup', (req, res, next) => { // { "email": xyz, "firstname": "xyz", "lastname": "xyz", "phone_num" : "xyz", "password": "xyz"}
  User.register(new User({
    username: req.body.email,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone_num: req.body.phone_num
  }), req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        console.log("hereee");
        res.json({ err: err, success: false });
      }
      else {
        user.save((err, usr) => {
          if (err) {
            res.statusCode = 200;
          console.log("hereeeeeeeeeeeeeeeeeeeeee");
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err, success: false });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            var token = authenticate.getToken({ _id: usr._id });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, user: usr, token, status: 'Registration Successful'});
          })
        })
      }
    }
  )
})

module.exports = router;
