const users = [];

function userJoined(socketid, username){
    const user = {socketid, username};

    users.push(user);
    // console.log(users);
    return user;
}

function getCurrentUser(socketid){
    return users.find(user => user.socketid === socketid);
}

function getUserSocketId(username){
    return users.find(user => user.username === username);
}

function userLeave(socketid) {
    const index = users.findIndex(user => user.socketid === socketid);
    
    if(index != -1){
        return users.splice(index, 1);
    }
}

function isUserOnline(username){
    var i;
    for (i = 0; i < users.length; i++){
        if(users[i].username === username){
            return true;
        }
    }
    return false;
}

module.exports = {
    userJoined,
    getCurrentUser,
    userLeave,
    getUserSocketId,
    isUserOnline
};