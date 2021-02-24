const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OrderSchema = Schema({
    items: {type: [
        {product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: String,
            default: '1'
        }}
    ]},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tip: {
        type: String
    },
    promo_code: {
        type: String
    },
    delivery_address: {
        type: String
    },
    total: {
        type: Number
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);