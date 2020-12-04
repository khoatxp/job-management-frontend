import React,{useState} from 'react';
import {Grid, Button} from 'semantic-ui-react'
import { ListGroup } from 'react-bootstrap'
export default function MessageRooms(props){
    const [activeItem, setActiveItem] = useState()
    return(
        <>
          
            <ListGroup variant="flush">
          
            {
                props.messageRooms.map( (messageRoom, index) => 
                <Button 
                 color={activeItem === messageRoom.messagingWith?"blue":"black"}
                 onClick = {()=>{
                     setActiveItem(messageRoom.messagingWith)
                     console.log(props.socket)
                    }
                }
                 active = {activeItem === messageRoom.messagingWith}
                >
                <Grid.Column >
                    <Grid.Row>
                     {messageRoom.messagingWith}
                    </Grid.Row>
                    <Grid.Row>
                    {props.messageRoomsInfos[index] && props.messageRoomsInfos[index].time}
                    <br/>
                    {props.messageRoomsInfos[index] && props.messageRoomsInfos[index].date}
                    </Grid.Row>
                </Grid.Column>
                </Button>
                )
                
            }
            </ListGroup>
   
        </>
    )
}