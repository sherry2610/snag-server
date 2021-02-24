var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
const Cart = require('../models/cart');


const authenticate = require('../authenticate');
var User = require('../models/user');
const Order = require('../models/order');
// const stripe = require('../setting');

router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, async (req, res, next) => {
    const ord = await Order.find({user: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, orders: ord});

})

router.post('/without-charge', authenticate.verifyUser, async (req, res, next) => {
        
    let c = await Cart.findOne({user: req.user._id})
    console.log("----------->>>>>>>>111",c)
    let cartt = c.items.map(item => {
        return {product: item.product, quantity: item.quantity};
    })
    console.log("----------->>>>>>>>222")
    await Order.create({user: req.user._id, items: cartt});
    console.log("----------->>>>>>>>333")
    await Cart.findOneAndUpdate({user: req.user._id},{$set : {items: []}})
    console.log("----------->>>>>>>>444")

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true});

})

router.post('/', authenticate.verifyUser, async (req, res, next) => {
    if (!req.body.amount){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'amount not present'});
    }
    else if (!req.body.card_name){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'card_name not present'});
    }
    else{
        
        let c = await Cart.findOne({user: req.user._id})
        console.log("----------->>>>>>>>111",c)
        let cartt = c.items.map(item => {
            return {product: item.product, quantity: item.quantity};
        })
        console.log("----------->>>>>>>>222")
        await Order.create({user: req.user._id, items: cartt, total: parseInt(req.body.amount)/100});
        console.log("----------->>>>>>>>333")
        await Cart.findOneAndUpdate({user: req.user._id},{$set : {items: []}})
        console.log("----------->>>>>>>>444")
        let charge;
        await req.user.cards.map(async card => {
            if (card.card_name === req.body.card_name){
                console.log("reached!")
                const stripe = require('stripe')('sk_test_51IDRhaIdmUDlgC55MuxgIdgVkN6frav8XIvKBEhEC1XicV7VlI26zHfqWwItoZw3p4prGlLX7iEwmHxcswrGq8ti00HMHPtn8U');
                charge = await stripe.charges.create({
                    amount: parseInt(req.body.amount),
                    currency: 'usd',
                    customer: card.customer.id,
                });
                console.log("reached! after",charge)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, stripe_response: charge});
            }
        })
    }
})

module.exports = router;