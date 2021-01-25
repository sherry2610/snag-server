var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();


const authenticate = require('../authenticate');
var User = require('../models/user');
const Order = require('../models/order');
const stripe = require('../setting');

router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, async (req, res, next) => {
    const ord = await Order.find({user: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, orders: ord});

})

router.post('/', authenticate.verifyUser, async (req, res, next) => {
    if (req.body.amount){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'amount not present'});
    }
    else if (req.body.card_name){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'card_name not present'});
    }
    else{
        let cartt = req.user.cart.map(item => {
            return {product: item.product, quantity: item.quantity};
        })
        await Order.create({user: req.user._id, items: cartt});
        await User.findOneAndUpdate({_id: req.user._id}, {$set: {carts: []}});
        let charge;
        req.user.cards.map(async card => {
            if (card.card_name === req.body.card_name){
                charge = await stripe.charges.create({
                    amount: parseInt(req.body.amount),
                    currency: 'usd',
                    customer: card.customer.id,
                });
            }
        })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, stripe_response: charge});
    }
})

module.exports = router