import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {  Grid, Transition } from 'semantic-ui-react';

import PostCard from '../components/PostCard';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
  const {
    loading,
    data: { getJobPosts: jobPosts } = {}
  } = useQuery(FETCH_POSTS_QUERY)
  return (
    <div>
    <Grid columns={2}>
      <Grid.Row className="page-title">
      <h1>Recent job posts:</h1>
      </Grid.Row>
      <Grid.Row>
       
        {loading ? (
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
    </div>
  );
}

export default Home;