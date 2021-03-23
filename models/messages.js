const mongo = require('mongoose');

const messageSchema = new mongo.Schema({
    username: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = mongo.model('messages', messageSchema);