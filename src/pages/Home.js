import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const {
    loading,
    data: { getJobPosts: jobPosts } = {}
  } = useQuery(FETCH_POSTS_QUERY)
  return (
    <Grid columns={1}>
      <Grid.Row className="page-title">
        
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          <Transition.Group>
            <h1>Recent job posts:</h1>
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

export default Home;