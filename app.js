var createError = require('http-errors');
var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
const paypal = require("paypal-rest-sdk");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var cartsRouter = require('./routes/carts');
var ordersRouter = require('./routes/orders');

// const connectDB = require('./connection/db')
// connectDB();

const config = require('./config');	 
const connectDB = require('./connection/db')	
// const connectDB = require('./connection/db')
// connecting with database //	
const mongoose = require('mongoose');	
const url = config.mongoUrl;	
// const connect = mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });	

// connect.then((db) => {	
//   console.log("Connected to the server.");	
// }, (err) => {	
//   console.log(err);	
// });	

connectDB();

// connected //

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/orders', ordersRouter);

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
      "ARLqN-Az987NFctLIRCTab5Ab56_S8y-OEY5zKInthRJqUo1eBQzk5DM9GIV0g5MQobFAYnVm8tsK3ej",
  client_secret:
      "EAQ_8nj47QjND2XimIe9AFasedX03qs0aKcnZcb4ojr4m5F9nIe-rt9e1aMtsaizSgzrfnSx7Jhr7-sd"
});


app.get('/paypal', async(req, res, next) => {
  var html = fs.readFileSync('./html/paypal.html', 'utf8')
  res.statusCode = 200;
  res.send(html);
})

app.get("/paypal/pay", (req, res) => {
  var create_payment_json = {
      intent: "sale",
      payer: {
          payment_method: "paypal"
      },
      redirect_urls: {
          return_url: "https://snagit-server.herokuapp.com/success",
          cancel_url: "https://snagit-server.herokuapp.com/cancel"
      },
      transactions: [
          {
              item_list: {
                  items: [
                      {
                          name: "item",
                          sku: "item",
                          price: "1.00",
                          currency: "USD",
                          quantity: 1
                      }
                  ]
              },
              amount: {
                  currency: "USD",
                  total: "1.00"
              },
              description: "This is the payment description."
          }
      ]
  };

  paypal.payment.create(create_payment_json, function(error, payment) {
      if (error) {
          throw error;
      } else {
          console.log("Create Payment Response");
          console.log(payment);
          res.redirect(payment.links[1].href);
      }
  });
});

app.get("/success", (req, res) => {
  // res.send("Success");
  var PayerID = req.query.PayerID;
  var paymentId = req.query.paymentId;
  var execute_payment_json = {
      payer_id: PayerID,
      transactions: [
          {
              amount: {
                  currency: "USD",
                  total: "1.00"
              }
          }
      ]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function(
      error,
      payment
  ) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          var html = fs.readFileSync('./html/success.html', 'utf8')
          res.statusCode = 200;
          res.send(html);
          // res.render("success");
      }
  });
});

app.get("cancel", (req, res) => {
  var html = fs.readFileSync('./html/cancel.html', 'utf8')
  res.statusCode = 200;
  res.send(html);
  // res.render("cancel");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
