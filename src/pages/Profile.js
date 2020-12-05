import { AuthContext } from '../context/auth';
import React,{useState, useEffect, useContext} from 'react';
import {  Grid,  Button, Card, CardContent, Form } from 'semantic-ui-react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function Profile(){
    const [selectedFile, setSelectedFile] = useState(null);
    const { user } = useContext(AuthContext);
    const userId = user.id;
    const [profile, setProfile] = useState();
    const [edit, setEdit] = useState(false);
    const {
        data: { getProfile } ={}
      } = useQuery(GET_PROFILE_QUERY,{
          variables:{
              userId
          }
      });
    const [firstName, setFirstName]=useState("");
    const [lastName, setLastName] =useState("");
    const [biography, setBiography] = useState("");
    const[changeProfile,{loading}]=useMutation(CHANGE_PROFILE_QUERY,{ 
        update() {
        window.location.reload();
      },variables: {
        userId,
        firstName: firstName,
        lastName: lastName,
        biography:biography
    }}
    )
    const [changeProfileUrlMutation] = useMutation(CHANGE_PROFILE_PICTURE_QUERY);

    useEffect(()=>{
        if(!firstName && getProfile){
            setFirstName(getProfile.firstName)
        }
        if(!lastName && getProfile){
            setLastName(getProfile.lastName)
        }
        if(!biography && getProfile){
            setBiography(getProfile.biography)
        }
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
                                        const response = await fetch('https://resumeservice-pvwu2w75ta-uw.a.run.app/user/profilepicture', requestOptions)
                                        const json = await response.json();
                                        const profileUrl = json.url;
                                        
                                        await changeProfileUrlMutation({ variables: {
                                                userId,
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
                            <Card.Header className="page-title"><h1>Profile</h1></Card.Header>
                            <Card.Description>
                            <div className="form-container">
                                <Form onSubmit={changeProfile} noValidate className={loading ? 'loading' : ''}>
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
                                    placeholder="First name.."
                                    name="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e)=>setFirstName(e.target.value)}
                                    readOnly={!edit}
                                    />
                                    <Form.Input
                                    label="Last name"
                                    placeholder="Last name.."
                                    name="lastName"
                                    value={lastName}
                                    type="text"
                                    onChange={(e)=>setLastName(e.target.value)}
                                    readOnly={!edit}
                                    />
                                    <Form.TextArea
                                    label="Biography"
                                    placeholder="Biography.."
                                    name="biography"
                                    type="text"
                                    value={biography}
                                    rows="10"
                                    onChange={(e)=>setBiography(e.target.value)}
                                    readOnly={!edit}
                                    />
                                    
                                    {edit &&
                                        <Button type="submit" secondary>
                                        Submit changes
                                        </Button>
                                    }
                                    
                                </Form>
                            
                                </div>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            {edit && <div>Only your first name, last name and biography are editable</div>}
                        <Button 
                        primary
                        floated="right"
                        onClick={() => setEdit(true)}
                        >Edit profile</Button>
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
    mutation changeProfileUrl($userId: ID!, $profileUrl: String!){
        changeProfileUrl(userId: $userId, profileUrl: $profileUrl)
    }
`

const CHANGE_PROFILE_QUERY = gql`
    mutation changeProfile(
        $userId: ID!
        $firstName: String!,
        $lastName: String!,
        $biography: String!
    ){
        changeProfile(
            firstName: $firstName,
            lastName: $lastName,
            biography: $biography,
            userId: $userId
        )
    }
`

const GET_PROFILE_QUERY= gql`
    query getProfile($userId: ID!){
        getProfile(userId: $userId){
            firstName
            lastName
            biography
            profileUrl
        }
    }
`

export default Profile;