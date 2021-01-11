const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CartSchema = Schema({
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
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);