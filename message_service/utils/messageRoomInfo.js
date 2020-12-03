
// to go into array of messageRooms in users database
function roomInfo(timeIn, dateIn, unreadIn) {
    return {
      time: timeIn,
      date: dateIn,
      unread: unreadIn
    };
  }
  
  module.exports = roomInfo;