import React, { useContext } from 'react';
import { Card,Button} from 'semantic-ui-react';
import { Link,useHistory } from 'react-router-dom';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import DeleteButton from './DeleteButton';


function PostCard({
  jobPost: { body, createdAt, id, username, company,title,salary,location }
}) {
  const { user } = useContext(AuthContext);
  let history = useHistory();
  function deletePostCallback() {
   
    history.push(window.location.pathname);
  }
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
        
      </Card.Content>
      <Card.Content extra>
        {user && user.username === username && 
        <div>
        <Link to={`/applicants/${id}`} >
        <Button
          as="div"
          color="blue"
          floated="right"
        >View Applicants</Button>
        </Link>
        <DeleteButton postId={id} callback={deletePostCallback}/>
        </div>
      }
  
      </Card.Content>
    </Card>
  );
}

export default (PostCard);