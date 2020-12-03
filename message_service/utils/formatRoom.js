// to go into array of messageRooms in users database
function formatRoom(messagewith, roomid) {
    return {
      messageRoomId: roomid,
      messagingWith: messagewith,
    };
  }
  
  module.exports = formatRoom;
  