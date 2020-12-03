const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usersSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    messageRooms: {
        type: Array,
        required: true
    }
});

const user = mongoose.model('user', usersSchema);
module.exports = user;