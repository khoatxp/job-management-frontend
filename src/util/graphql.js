import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
  {
    getJobPosts {
      id
      body
      createdAt
      username
      company
      title
      salary
      location
    }
  }
`;