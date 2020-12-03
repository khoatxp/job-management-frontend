
//see if message room already exists
function messageRoomExist(array, receiver){
    var i;
      for (i = 0; i < array.length; i++){
          if(array[i].messagingWith === receiver){
              return true;
          }
      }
      return false;
  }
  
  function findMessageRoom(array, receiver){
    return array.find(room => room.messagingWith === receiver);
  }

  module.exports = {
    messageRoomExist,
    findMessageRoom
};