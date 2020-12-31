const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    price: {
        type: String,
        required: true,
    },
    category: {
        type: [String]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);