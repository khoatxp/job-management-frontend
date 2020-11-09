import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import DeleteButton from './DeleteButton';


function PostCard({
  jobPost: { body, createdAt, id, username, company,title,salary,location }
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content as={Link} to={`/jobposts/${id}`}>
        <Card.Header>Job title: {title}</Card.Header>
        <Card.Meta>Company: {company}</Card.Meta>
        <Card.Meta>Estimated salary: {salary}</Card.Meta>
        <Card.Meta>Location: {location}</Card.Meta>
        <Card.Meta >
          posted {moment(createdAt).fromNow(true)} ago
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;