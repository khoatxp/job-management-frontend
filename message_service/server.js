const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const User = require('./models/users');
const MessageRoom = require('./models/messageRoom');
const formatRoom = require('./utils/formatRoom');
const formatMessage = require('./utils/formatMessage');
const {getCurrentUser, userJoined, userLeave, getUserSocketId, isUserOnline} = require('./utils/connectedUsers');
const roomInfo = require('./utils/messageRoomInfo');
const {messageRoomExist, findMessageRoom} = require('./utils/roomfuncs');
const app = express()
const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static(path.join(__dirname, 'public')));


var dbUrl = "mongodb+srv://khoatxp:GfAxnlFdEOYbDUJ8@cluster0.ibt1p.mongodb.net/dev?retryWrites=true&w=majority";

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true} ,(err) => {
    if(err) throw err;
    console.log('mongodb connected');
  });

const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



io.on('connection', socket => {
  socket.on('connectUser', (username) => {
      const user = userJoined(socket.id, username);
      console.log(`${user.username} connected`);
  });



  //Runs when client disconnects
  socket.on('disconnect', () => {

    // console.log('disconnect');
      const user = userLeave(socket.id);
  });


  //Get message rooms when user first connects
  socket.on('getMessageRooms', (username) => {
    User.findOne({username: username}).then((result) => {
      //get all message room ids
      var arr = [];
      var i;
      for(i = 0; i < result.messageRooms.length; i++){
        const obj1 = {_id: result.messageRooms[i].messageRoomId};
        arr.push(obj1);
      }
     
      //get dates and times
      var timesArr = [];

      if(arr.length > 0){
        MessageRoom.find().or(arr).then((result2) => {
          var i;
          for(i = 0; i < result2.length; i++){
            var tObj;
            if(username == result2[i].users[0]){
              tObj = roomInfo(result2[i].mostRecentTime, result2[i].mostRecentDate, result2[i].unreadUser1);
            }else{
              tObj = roomInfo(result2[i].mostRecentTime, result2[i].mostRecentDate, result2[i].unreadUser2);
            }
            
            timesArr.push(tObj);
          }
  
          socket.emit('receiveMessageRooms', result.messageRooms, timesArr);
        });
       
        //if array is empty, find().or(arr) needs non-empty array
      }else{
        socket.emit('receiveMessageRooms', [], []);
      }
 
    })
  });


  //Get Messages from specific room
  socket.on('getMessagesFromRoom', (id, unread) => {
    
    MessageRoom.findById(id).then((result) => {
      //switch all unread to false
      if(unread){
        result.unreadUser1 = false;
        result.unreadUser2 = false;
        result.save();
      }

      socket.emit('receiveMessagesFromRoom',result.messages.reverse());
    });
    
  });




  //listen for chatMessage
  socket.on('sendMessage', ({msg, receiver}) => {
      //current user
      const user = getCurrentUser(socket.id);
      User.findOne({username: user.username}).then((result) => {

        //checks to see if messageRoom does not exist(aka first message between the two)
        const roomExist = messageRoomExist(result.messageRooms, receiver);
        if(!roomExist){

          //Create a new message Room
          const formattedMessage = formatMessage(user.username, msg);
          const messageRoom = new MessageRoom({
            users: [user.username , receiver],
            mostRecentTime: formattedMessage.timeSent,
            mostRecentDate: formattedMessage.dateSent,
            unreadUser1: false,
            unreadUser2: true,
            messages: [formattedMessage]
          });
          let roomId = messageRoom._id;
          messageRoom.save();


          //add room to receivers messageRooms array
          User.findOne({username: receiver}).then((result) => {
            const room = formatRoom(user.username, roomId);
            result.messageRooms.push(room);
            result.save();
          });



          // add to senders messageRooms array
          const room2 = formatRoom(receiver, roomId);
          result.messageRooms.push(room2);
          result.save();

          //send update to person who sent the message
          socket.emit('updateMessagesToUser', result._id, formattedMessage, receiver);

          //send update to person being sent message
          if(isUserOnline(receiver)){
            const receiverid = getUserSocketId(receiver);
            io.to(receiverid.socketid).emit('updateMessagesToUser', result._id, formattedMessage, user.username);
          }

        }else{
          const formattedMessage = formatMessage(user.username, msg);
          
          //get roomid
          let roomid = findMessageRoom(result.messageRooms, receiver);
          

          MessageRoom.findById(roomid.messageRoomId).then((result) => {

            if(receiver == result.users[0]){
              MessageRoom.update({_id:roomid.messageRoomId}, {unreadUser1: true});
            }else{
              MessageRoom.update({_id:roomid.messageRoomId}, {unreadUser2: true});
            }
            
            result.mostRecentDate = formattedMessage.dateSent;
            result.mostRecentTime = formattedMessage.timeSent;
            //add new message to room
            result.messages.push(formattedMessage);
            result.save();
            //emit to users who sent the message
            socket.emit('updateMessagesToUser', result._id, formattedMessage, receiver, false);

            //send update to person being sent message
            if(isUserOnline(receiver)){
                    const receiverid = getUserSocketId(receiver);
                    io.to(receiverid.socketid).emit('updateMessagesToUser', result._id, formattedMessage, user.username, true);
            }
          });
        }
        
      });
      
  });

});
