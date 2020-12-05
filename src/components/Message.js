import React, { useContext } from 'react'
import classNames from 'classnames'
//import moment from 'moment'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { AuthContext } from '../context/auth';




export default function Message({message,index}) {
  const { user } = useContext(AuthContext);
  const sent = message.sender === user.username
  const received = !sent
  //moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')
  return (
    <OverlayTrigger
      placement={sent ? 'right' : 'left'}
      overlay={
        <Tooltip>
          {message && message.timeSent}
          <br/>
          {message && message.dateSent}
        </Tooltip>
      }
      transition={false}
    >
      <div
        className={classNames('d-flex my-3', {
          'ml-auto': sent,
          'mr-auto': received,
        })}
      >
        <div
          className={classNames('py-2 px-3 rounded-pill', {
            'bg-primary': sent,
            'bg-secondary': received,
          })}
        >
          <p className={classNames({ 'text-white': sent })} key={index}>
            {message && message.message}
          </p>
        </div>
      </div>
    </OverlayTrigger>
  )
}