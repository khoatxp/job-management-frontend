import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  Card,
  Grid, Button
} from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';


function SinglePost(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const {
    data: { getJobPost } ={}
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });
  const [addApplicantMutation] = useMutation(ADD_APPLICANT_MUTATION);
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
      title,
      company,
      location,
      salary,
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
                <Card.Header>Job title: {title}</Card.Header>
                <Card.Meta>Company: {company}</Card.Meta>
                <Card.Meta>Estimated salary: {salary}</Card.Meta>
                <Card.Meta>Location: {location}</Card.Meta>
                <Card.Meta >
                  posted {moment(createdAt).fromNow(true)} ago by {username}
                </Card.Meta>
                <Card.Description>
                  <pre id="body">{body}</pre>
                </Card.Description>
              </Card.Content>
              {user && user.username !== username && 
                <Card.Content>
                  <Card.Header>Apply for this job:</Card.Header>
                  <Card.Description>
                    <div>
                      <div>
                      <input  type="file" id="file" name="resume" onChange={(event)=>{setSelectedFile(event.target.files[0])}}/>
                      </div>
                      <Button
                       as="div"
                       color="blue"
                       floated="right"
                       onClick ={async ()=>{
                        //set loading indicator
                        document.querySelector("h1").innerHTML="Loading...";
                        if(selectedFile === null){
                          window.alert("File is empty");
                          return;
                        }

                        //check if size is too large
                        if (selectedFile.size > 5242880) {
                          alert('File size too large (limit 5 MB)')
                          console.error("File size too large")
                          return;
                        }

                        //prepare file before sending to servers
                        const body = new FormData()
                        body.append("file", selectedFile)
                        body.append("userId", user.id)
                        console.log(user.id)
                        const requestOptions = {
                          method: 'POST',
                          body: body
                        };
                       
                        //send to bucket
                        const response1 = await fetch('https://resumeservice-pvwu2w75ta-uw.a.run.app/resume', requestOptions)
                        const json1 = await response1.json();
                        const originalFile = json1.url;
                        console.log(originalFile);
                        //get parsed resume
                        const response2= await fetch('https://resumeservice-pvwu2w75ta-uw.a.run.app/resume/parse', requestOptions)
                        const json2 = await response2.json();
                        const resume =  JSON.stringify(json2.data);
                        const postId = id;
                       
                        await addApplicantMutation({ variables: {
                          postId,
                          resume,
                          originalFile
                        }}).then(()=>{
                          document.querySelector("h1").innerHTML="";
                          window.alert("Resume submitted successfully");
                        });
                        
                        
                      }}>Submit</Button>
                      <h1 className="page-title"></h1>
                    </div>
                  </Card.Description>
                </Card.Content>
              }
              
              <hr />
              <Card.Content extra>
                {user && user.username === username && (
                  <>
                  <Link to={`/applicants/${id}`} >
                  <Button
                    as="div"
                    color="blue"
                    floated="right"
                  >View Applicants</Button>
                  </Link>
                  <DeleteButton postId={id} callback={deletePostCallback} />
                  </>
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

const ADD_APPLICANT_MUTATION = gql`
  mutation addApplicant($postId: ID!, $resume: String!, $originalFile: String!) {
    addApplicant(postId: $postId, resume: $resume, originalFile: $originalFile)
  }
`;

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