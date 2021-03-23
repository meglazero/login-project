const mongo = require('mongoose');

const userAuthSchema = new mongo.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongo.model('UserAuth', userAuthSchema);