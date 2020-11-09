import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import {
  Card,
  Grid
} from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';


function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const {
    data: { getJobPost }
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });
  function deletePostCallback() {
    props.history.push('/');
  }

  let postMarkup;
  if (!getJobPost) {
    postMarkup = <p>Loading post..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
    } = getJobPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}


const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getJobPost(postId: $postId) {
      id
      body
      createdAt
      username
      title
      company
      location
      salary
    }
  }
`;

export default SinglePost;