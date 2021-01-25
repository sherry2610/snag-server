var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();


const authenticate = require('../authenticate');
var User = require('../models/user');
var passport = require('passport');
const Cart = require('../models/cart');

router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, async (req, res, next) => {
    var cart = await Cart.findOne({user: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, cart: cart});
});

router.put('/editcart', authenticate.verifyUser, async (req, res, next) => { // {product_id, quantity} or {lst: [{product_id, quantity}]}
    if (req.body.lst){
        req.body.lst.map(async (val, ind) => {
            console.log(val, ind);
            let mainCart = await Cart.findOne({user: req.user._id, "items.product": val.product_id});
            if (mainCart){
                console.log(val, val.quantity === "0");
                if (val.quantity === "0"){
                    let cc = await Cart.findOneAndUpdate({user: req.user._id}, {$pull: {items: {product: val.product_id}}}, {multi: true, new: true});
                    console.log("cc   ",cc);
                }
                else{
                    mainCart.items.forEach((v, i) => {
                        if (mainCart.items[i].product.equals(val.product_id)){
                            mainCart.items[i].quantity = val.quantity;
                        }
                    })
                    await mainCart.save();   
                }
                console.log(ind+1 === req.body.lst.length, ind+1, req.body.lst.length);
                if (ind+1 === req.body.lst.length){
                    const cartt = await Cart.findOne({user: req.user._id});
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, cart: cartt});
                }
            }
            else{
                if (quantity !== "0"){
                    await Cart.findOneAndUpdate({user: req.user._id}, {$push: {items: {product: val.product_id, quantity: val.quantity}}});
                }
                console.log(ind+1 === req.body.lst.length, ind+1, req.body.lst.length);
                if (ind+1 === req.body.lst.length){
                    const cartt = await Cart.findOne({user: req.user._id});
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, cart: cartt});
                }
            }
        });
    }
    else{
        Cart.findOne({user: req.user._id, "items.product": req.body.product_id})
        .then(mainCart => {
            console.log(mainCart);
            if (mainCart){
                if (req.body.quantity === "0"){
                    Cart.findOneAndUpdate({user: req.user._id}, {$pull: {items: {product: req.body.product_id}}}, {new: true, multi: true})
                    .then(c => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, cart: c});
                    });
                }
                else{
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
            }
            else{
                if (quantity !== "0"){
                    Cart.findOneAndUpdate({user: req.user._id}, {$push: {items: {product: req.body.product_id, quantity: req.body.quantity}}}, {new: true})
                    .then(c => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, cart: c});
                    });
                }
                else{
                    Cart.findOne({user: req.user._id})
                    .then(c => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, cart: c});    
                    })
                }
            }
        });
    }
})

module.exports = router;
