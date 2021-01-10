var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();


const authenticate = require('../authenticate');
var User = require('../models/user');
var passport = require('passport');
const Cart = require('../models/cart');

router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, async (req, res, next) => {
    var cart = await Cart.findOne({user: req.user._id}).populate('item').populate('item.product');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, cart: cart});
});

router.put('/editcart', authenticate.verifyUser, async (req, res, next) => { // {product_id, quantity}
    var item = await item.create({product: req.body.product_id, quantity: req.body.quantity});
    Cart.findOneAndUpdate({user: req.user._id}, {})

})

module.exports = router;
