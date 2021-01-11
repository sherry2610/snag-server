var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();


const authenticate = require('../authenticate');
var User = require('../models/user');
var passport = require('passport');
const Cart = require('../models/cart');

router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, async (req, res, next) => {
    var cart = await Cart.findOne({user: req.user._id}).populate('items');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, cart: cart});
});

router.put('/editcart', authenticate.verifyUser, async (req, res, next) => { // {product_id, quantity}
    Cart.findOne({user: req.user._id, "items.product": req.body.product_id}).populate("items")
    .then(mainCart => {
        console.log(mainCart);
        if (mainCart){
            mainCart.items.forEach((val, i) => {
                if (mainCart.items[i].product.equals(req.body.product_id)){
                    mainCart.items[i].quantity = req.body.quantity;
                }
            })
            mainCart.save((err, c) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, cart: c});
            })
        }
        else{
            Cart.findOneAndUpdate({user: req.user._id}, {$push: {items: {product: req.body.product_id, quantity: req.body.quantity}}}, {new: true})
            .then(c => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, cart: c});
            });
        }
    });
})

module.exports = router;
