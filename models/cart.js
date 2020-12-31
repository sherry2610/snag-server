const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CartSchema = Schema({
    items: {type: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ]},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);