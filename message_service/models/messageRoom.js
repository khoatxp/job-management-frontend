const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var messageRoomSchema = new Schema({
    users: {
        type: Array,
        required: true
    },
    mostRecentTime: {
        type: String,
        required: true
    },
    mostRecentDate: {
        type: String,
        required: true
    },
    messages: {
        type: Array,
        required: true
    },
    unreadUser1: {
        type: Boolean,
        required: true,
    },
    unreadUser2: {
        type: Boolean,
        required: true,
    }
}, { collection: 'messageRooms'});

const messageRoom = mongoose.model('messageRoom', messageRoomSchema);

module.exports = messageRoom;