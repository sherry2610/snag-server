const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone_num: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    address: {
        type: String
    },
    cards: {type: [
        {
            customer: {
                type: Object,
            },
            card_name: {
                type: String,
            }
        }
    ]}
}, {
    timestamps: true
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);