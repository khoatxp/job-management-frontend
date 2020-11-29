import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';


function PostedJobs() {
  const { user } = useContext(AuthContext);
  var username = user===null?'':user.username;
  const {
    loading,
    data: { getJobPostsBy: jobPosts } = {}
  } = useQuery(FETCH_POSTS_QUERY_BY, {
    variables: {
      username
    }
  });
  return (
    <Grid columns={2}>
      <Grid.Row className="page-title">
      <h1>Jobs posted by you:</h1>
      </Grid.Row>
      <Grid.Row>
        {user && loading ? (
          <h1>Loading posts..</h1>
        ) : (
          <Transition.Group>
            
            {jobPosts &&
              jobPosts.map((jobPost) => (
                <Grid.Column key={jobPost.id} style={{ marginBottom: 20 }}>
                  
                  <PostCard jobPost={jobPost} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POSTS_QUERY_BY = gql`
  query($username: String!) {
    getJobPostsBy(username: $username) {
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
export default PostedJobs;