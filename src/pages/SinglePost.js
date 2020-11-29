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
                  posted {moment(createdAt).fromNow(true)} ago
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              {user && user.username !== username && 
                <Card.Content>
                  <Card.Header>Apply for this job:</Card.Header>
                  <Card.Description>
                    <div>
                      <div>
                      <input class="choose" type="file" id="file" name="resume" onChange={(event)=>{setSelectedFile(event.target.files[0])}}/>
                      </div>
                      <Button
                       as="div"
                       color="blue"
                       floated="right"
                       onClick ={async ()=>{
                        document.querySelector("text").innerHTML="Loading...";
                        if(selectedFile === null){
                          window.alert("File is empty");
                          return;
                        }
                        const toBase64 = file => new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = () => resolve(reader.result);
                          reader.onerror = error => reject(error);
                        });
                        if (selectedFile.size > 5242880) {
                          alert('File size too large (limit 5 MB)')
                          console.error("File size too large")
                          return;
                        }
                        const file = await toBase64(selectedFile);
                        console.log(selectedFile);
                        const requestOptions = {
                          method: 'POST',
                          body: `{"content": "${file.split(',')[1]}"}`,
                          headers: { "content-type": "application/json"}
                        };
                        const response= await fetch('https://sleepy-hollows-73003.herokuapp.com/parseResume', requestOptions)
                        const json = await response.json();
                        const resume =  JSON.stringify(json);
                        const postId = id;
                        await addApplicantMutation({ variables: {
                          postId,
                          resume
                        }}).then(()=>{
                          document.querySelector("text").innerHTML="";
                          window.alert("Resume submitted successfully");
                        });
                        
                      }}>Submit</Button>
                      <text className="page-title"></text>
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
  mutation addApplicant($postId: ID!, $resume: String!) {
    addApplicant(postId: $postId, resume: $resume)
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