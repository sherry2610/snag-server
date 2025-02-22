var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();


const authenticate = require('../authenticate');
var User = require('../models/user');
var Cart = require('../models/cart');
var passport = require('passport');
var stri = require('../setting');
const e = require('express');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getuser', authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, user: req.user});
})

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
          else{
            var token = authenticate.getToken({_id: req.user._id});

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, user: user, token: token, status: 'Login Successful!'});
          }
    });
    })(req, res, next);
})

router.post('/signup', (req, res, next) => { // {"username": xyz, "email": xyz, "firstname": "xyz", "lastname": "xyz", "phone_num" : "xyz", "password": "xyz"}
  User.register(new User({
    username: req.body.username,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone_num: req.body.phone_num
  }), req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err, success: false });
      }
      else {
        user.save((err, usr) => {
          if (err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err, success: false });
          }
          passport.authenticate('local')(req, res, async () => {
            console.log("here");
            if (req.body.cart){
              await Cart.create({user: usr._id, items: req.body.cart});
            }
            else{
              await Cart.create({user: usr._id});
            }
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

router.put('/editprofile', authenticate.verifyUser, async (req, res, next) => {
  var user = await User.findOne({_id: req.user._id});
  if (user){
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.username = req.body.email;
    user.phone_num = req.body.phone_num;
    user.save((err, usr) => {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, user: usr, status: 'Update Successful'});
    });
  }
  else{
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: false, status: 'Invalid JWT'});
  }
})

router.put('/setpwd', authenticate.verifyUser, (req, res, next) => {
  User.findOne({_id: req.user._id})
  .then(user => {
    user.setPassword(req.body.password, (err, usr) => {
      if (!err) {
        usr.save(async (err, usr) => {
          if (err) {
            console.log(err, 'while updating pwd')
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Password Changed!'});
        })
      }
    })
  })
});


router.post('/add-card', authenticate.verifyUser, async (req, res, next) => {
  if (!req.body.token){
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'req.body.token not present'});
  }
  else if (!req.body.card_name){
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'req.body.card_name not present'});
  }
  else{
    const stripe = require('stripe')('sk_test_51IDRhaIdmUDlgC55MuxgIdgVkN6frav8XIvKBEhEC1XicV7VlI26zHfqWwItoZw3p4prGlLX7iEwmHxcswrGq8ti00HMHPtn8U');
    console.log("mark1----------->>>>>>>> stri",stripe.customers)
    const customer = await stripe.customers.create({
      source: req.body.token,
      email: req.user.email,
    });
    console.log("mark2----------->>>>>>>>")
    User.findOneAndUpdate({_id: req.user._id}, {$push: {cards: {customer: customer, card_name: req.body.card_name}}}, {new: true})
    .then(usr => {
      console.log("mark1----------->>>>>>>>")
      res.statusCode = 200 ;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, user: usr});
    })
    
  }
})


module.exports = router;
