import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Applicant from '../components/Applicant'
import { AuthContext } from '../context/auth';

function Applicants(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  
  const {
    data: { getJobPost } ={}
  } =  useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  let postMarkup;
  if (!getJobPost) {
    postMarkup = <p>Loading ...</p>;
  } else {
    const {
      username,
      applicants
    } = getJobPost;
   
    postMarkup =(
        <>
        {user && username===user.username && applicants && applicants.map((applicant)=>(
            <Applicant applicant={applicant}></Applicant>
        ))}
        {user && username===user.username && !applicants.length && <p>There are no applicants for this post yet</p>}
        {user && username!==user.username && <p>Oops, page not found</p>}
        </>
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
      applicants{
        resume
        username
        submittedAt
        originalFile
      }
    }
  }
`;


export default Applicants;