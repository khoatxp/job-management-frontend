import React,{Fragment,useState, useContext, useEffect} from 'react';
import socketIOClient from "socket.io-client";
import { AuthContext } from '../context/auth';
import { Col, Form, Row } from 'react-bootstrap'
import Message from '../components/Message';
import {  Grid,Button} from 'semantic-ui-react';
import { ListGroup } from 'react-bootstrap';
import '../App.scss'
var socket = socketIOClient("http://localhost:3001/");
//var socket = socketIOClient("https://planar-cell-292909.wl.r.appspot.com/");
export default function Chat(){

    const { user } = useContext(AuthContext);
    const [messageRooms, setMessageRooms] = useState([]);
    const [messageRoomsInfos, setMessageRoomsInfos] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeRoomId, setActiveRoomId] = useState("")
   
    useEffect(()=>{
        socket.emit('connectUser', user.username);
        
        socket.on('receiveMessagesFromRoom', (messages) =>{
            //Previous messages from specific room
            setMessages(messages)
        })
        socket.on('receiveMessageRooms', (array, roomInfo) =>{
            //Message room
            sortDates(array, roomInfo);
            setMessageRooms(array);
            setMessageRoomsInfos(roomInfo);
            
        })
        socket.emit('getMessageRooms', user.username);
    }
    ,[])
 
    useEffect(()=>{
       
        socket.on('updateMessagesToUser', (roomId, formattedMessage, name, unread) =>{
            if(activeRoomId === roomId){
                //setMessages(messages=>[...messages,formattedMessage]);
                socket.emit('getMessagesFromRoom', activeRoomId, true)
             
            }
            
        })
  
    },[activeRoomId, messages])
    

    const [msg, setMsg] = useState("");
    const [receiver, setReceiver] = useState("");
    
    return(
        <>
        <Fragment>
            <Row className="bg-white">
                <Col xs={2} md={4} className="p-0 bg-secondary">
                    <ListGroup variant="flush">
                        {
                            messageRooms && messageRooms.map( (messageRoom, index) => 
                        
                            
                            <Button
                            key={index} 
                            color={activeRoomId === messageRoom.messageRoomId?"blue":"black"}
                            onClick = {()=>{
                                setActiveRoomId(messageRoom.messageRoomId)
                                setReceiver(messageRoom.messagingWith)
                                socket.emit('getMessagesFromRoom', messageRoom.messageRoomId, true)
                                }
                            }
                            >
                            <Grid.Column >
                                <Grid.Row>
                                {messageRoom.messagingWith}
                                </Grid.Row>
                                <Grid.Row className="right">
                                {messageRoomsInfos[index] && messageRoomsInfos[index].time}
                                <br/>
                                {messageRoomsInfos[index] && messageRoomsInfos[index].date}
                                </Grid.Row>
                            </Grid.Column>
                            </Button>
                            )
                            
                        }
                    </ListGroup>
                </Col>
                <Col xs={10} md={8}>
                    <div className="messages-box d-flex flex-column-reverse">
                        {messages && messages.map((message, index)=>(
                             <Fragment key={index}>
                                <Message message={message} index={index}/>
                                {messages.length && index === messages.length - 1 && (
                                <div className="invisible">
                                    <hr className="m-0" />
                                </div>
                                )}
                             </Fragment>
                            ))}
                    </div>
                    <div>
                    <Form >
                        <Form.Group className="d-flex align-items-center">
                            <Form.Control
                            type="text"
                            className="message-input rounded-pill p-4 bg-secondary border-0"
                            placeholder="Type a message..."
                            value={msg}
                            onChange={(event)=>setMsg(event.target.value)}
                            
                            />
                            <Button
                         
                            className="fas fa-paper-plane fa-2x text-primary ml-2"
                            onClick={(e)=>{
                                e.preventDefault();
                                
                                socket.emit('sendMessage',{receiver,msg})
                                    setMsg("");
                                }}
                            role="button"
                            >Send
                            </Button>
                        </Form.Group>
                    </Form>
                    </div>
                </Col>
            </Row>
        </Fragment>
       {/* <div>

             <Grid>
                <Grid.Column width={4}>
               
                    <MessageRooms messageRooms={messageRooms} messageRoomsInfos={messageRoomsInfos} callback={setActiveItemCallback}></MessageRooms>
                    
                                
                </Grid.Column>
                <Grid.Column width={12}>
                    <Grid.Row>
                        {messages && messages.map((message, index)=>(
                            
                            <Message key={index} message={message} index={index}></Message>
                         
                        ))}
                    </Grid.Row>
                    <Grid.Row>
                    <div className="form-container">
                        <form id="chat-form">
                        <input 
                            id="receiver"
                            name="receiver"
                            type="text"
                            placeholder="To"
                            value={receiver}
                            onChange={(event)=>setReceiver(event.target.value)}
                            />
                            
                        <input
                            id="msg"
                            name="msg"
                            type="text"
                            placeholder="Enter Message"
                            required
                            autoComplete="off"
                            value={msg}
                            onChange={(event)=>setMsg(event.target.value)}
                        />
                        <button onClick={(e)=>{
                            e.preventDefault();
                            
                            socket.emit('sendMessage',{receiver,msg})
                                setReceiver("");
                                setMsg("");
                            }}
                            className="btn"><i className="fas fa-paper-plane"></i> Send</button>
                        </form>
                    </div>
                    
                    </Grid.Row>
                
                </Grid.Column>
            </Grid>
                        </div> */}
                        </>
    )
}
function sortDates(array, roomInfo){
    var datesArr = [];
    for(let i = 0; i < roomInfo.length; i++){
       datesArr.push(roomInfo[i].date.concat(' ', roomInfo[i].time));
    }
    var i;
    var key;
    var j;
    for(i = 1; i < datesArr.length; i++){
     key = datesArr[i]; 
     var key2 = array[i];
     var key3 = roomInfo[i];
     j = i - 1;
      while(j >= 0 && datesArr[j] < key){
        datesArr[j + 1] = datesArr[j];
        array[j + 1] = array[j];
        roomInfo[j + 1] = roomInfo[j];
        j = j - 1;
      }
      datesArr[j + 1] = key;
      array[j + 1] = key2;
      roomInfo[j + 1] = key3;
    }
    
}
