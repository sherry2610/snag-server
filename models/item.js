const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: String,
        default: '1'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);