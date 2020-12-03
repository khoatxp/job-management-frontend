import React from 'react';

import io from 'socket.io-client'

function MessageBox(){
    var socket = io("http://localhost:3001/")
    socket.emit('connectUser','user1');
    socket.emit('sendMessage', {receiver:'user2',msg:'whatever'});
    return(
        <>
            <h1>Hello World </h1>
        </>
    )
}

export default MessageBox;