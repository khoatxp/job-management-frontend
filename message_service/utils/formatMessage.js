const moment = require('moment');

// to go into array of messageRooms in users database
function formatMessage(from, msg) {
    return {
      sender: from,
      message: msg,
      timeSent: moment().format('h:mm a'),
      dateSent: moment().format('DD-MM-YYYY')
    };
  }
  
  module.exports = formatMessage;