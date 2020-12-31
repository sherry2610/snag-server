const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OrderSchema = Schema({
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

module.exports = mongoose.model('Order', OrderSchema);