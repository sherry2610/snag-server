var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();


const authenticate = require('../authenticate');
var User = require('../models/user');
var passport = require('passport');
const Product = require('../models/product');

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    var products = await Product.find({});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, products: products});
});

router.get('/category/:cat', async (req, res, next) => {
    var products = await Product.find({category: req.params.cat});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, products: products});
})

module.exports = router;
