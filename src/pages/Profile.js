import { AuthContext } from '../context/auth';
import React,{useState, useEffect, useContext} from 'react';
import {  Grid,  Button, Card, CardContent, Form } from 'semantic-ui-react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function Profile(){
    const [selectedFile, setSelectedFile] = useState(null);
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState();
    const {
        data: { getProfile } ={}
      } = useQuery(GET_PROFILE_QUERY);
    const [firstName, setFirstName]=useState("");
    const [lastName, setLastName] =useState("");
    const [biography, setBiography] = useState("");
    const[changeProfile,{loading}]=useMutation(CHANGE_PROFILE_QUERY,{ 
        update() {
        window.location.reload();
      },variables: {
        firstName: firstName,
        lastName: lastName,
        biography:biography
    }}
    )
    const [changeProfileUrlMutation] = useMutation(CHANGE_PROFILE_PICTURE_QUERY);
    useEffect(()=>{
        if(user && getProfile){
            setProfile(getProfile.profileUrl)
        }
    },[user,getProfile])
    let profileCard;
    if(!getProfile){
        profileCard = <p>Loading profile...</p>
    }
    else{
    
    profileCard=(
        <>
           <Grid>
               <Grid.Row>
                   <Grid.Column width={4}>
                       <Card fluid>
                           <CardContent>
                               {console.log(profile)}
                                <img style={styles.picture} src={profile} alt="profile" />
                           </CardContent>
                           <CardContent>
                                <Card.Header>Change profile picture</Card.Header>
                                <Card.Description>
                                <div>
                                    <div>
                                    <input  type="file" id="file" name="profilePicture" onChange={(event)=>{setSelectedFile(event.target.files[0])}} />
                                    </div>
                                    <Button
                                     secondary
                                     floated="right"
                                     onClick={async ()=>{
                                        document.querySelector("h1").innerHTML="Loading...";
                                        console.log(selectedFile)
                                        if(selectedFile === null){
                                        window.alert("File is empty");
                                        document.querySelector("h1").innerHTML=""
                                        return;
                                        }

                                        //check if size is too large
                                        if (selectedFile.size > 5242880) {
                                        alert('File size too large (limit 5 MB)')
                                        document.querySelector("h1").innerHTML=""
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
                                        const response = await fetch('https://resumeservice-vbryqcvj2a-uw.a.run.app/user/profilepicture', requestOptions)
                                        const json = await response.json();
                                        const profileUrl = json.url;
                                        
                                        await changeProfileUrlMutation({ variables: {
                                                profileUrl
                                            }}).then(()=>{
                                                document.querySelector("h1").innerHTML="";
                                                window.location.reload();
                                            });
                                        }}
                                    >
                                        Submit
                                    </Button>
                                    <h1 className="page-title"></h1>
                                </div>
                                </Card.Description>
                           </CardContent>
                       </Card>
                   </Grid.Column>
                   <Grid.Column width={12}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header className ="page-title"><h1>Profile</h1></Card.Header>
                            <div className="form-container">
                                <Form>
                                <Form.Input
                                    label="Username"
                                    type="text"
                                    value={user.username}
                                    readOnly={true}
                                    />
                                <Form.Input
                                    label="Email"
                                    type="text"
                                    value={user.email}
                                    readOnly={true}
                                    />
                                <Form.Input
                                    label="First name"
                                    type="text"
                                    value={getProfile.firstName}

                                    />
                                <Form.Input
                                    label="Last name"
                                    type="text"
                                    value={getProfile.lastName}

                                    />
                                
                                <Form.Input
                                    label="Biography"
                                    type="text"
                                    
   
                                    >
                                    <Card fluid>
                                        <Card.Content>
                                            <pre id="body">{getProfile.biography}</pre>
                                        </Card.Content>
                                        
                                    </Card>
                                </Form.Input>
                                
                                </Form>
                            </div>
                        </Card.Content>
                        <Card.Content>
                            <Card.Header className="page-title"><h1>Edit Profile</h1></Card.Header>
                            <Card.Description>
                            <div className="form-container">
                                <Form onSubmit={changeProfile} noValidate className={loading ? 'loading' : ''}>
                                   
                                    <Form.Input
                                    label="Edit first name"
                                    placeholder="First name.."
                                    name="firstName"
                                    type="text"
                                    onChange={(e)=>setFirstName(e.target.value)}
                                    />
                                    <Form.Input
                                    label="Edit last name"
                                    placeholder="Last name.."
                                    name="lastName"
                                    type="text"
                                    onChange={(e)=>setLastName(e.target.value)}
                                    />
                                    <Form.TextArea
                                    label="Edit biography"
                                    placeholder="Biography.."
                                    name="biography"
                                    type="text"
                                    rows="10"
                                    onChange={(e)=>setBiography(e.target.value)}
                                    />
                                    {firstName && lastName && biography &&
                                        <Button type="submit" primary>
                                        Submit changes
                                        </Button>
                                    }
                                    
                                </Form>
                            
                                </div>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                   </Grid.Column>
               </Grid.Row>
            </Grid>
        </>
    )
}
    return profileCard;
}

const styles = {
    picture: {
      height: 280,
      width: 230,
      padding: 7,
      outline: 'none',
    }
  }

const CHANGE_PROFILE_PICTURE_QUERY=gql`
    mutation changeProfileUrl($profileUrl: String!){
        changeProfileUrl(profileUrl: $profileUrl)
    }
`

const CHANGE_PROFILE_QUERY = gql`
    mutation changeProfile(
        $firstName: String!,
        $lastName: String!,
        $biography: String!
    ){
        changeProfile(
            firstName: $firstName,
            lastName: $lastName,
            biography: $biography
            
        )
    }
`

const GET_PROFILE_QUERY= gql`
    query getProfile{
        getProfile{
            firstName
            lastName
            biography
            profileUrl
        }
    }
`

export default Profile;