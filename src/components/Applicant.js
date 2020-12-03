import {
    Card,
    Button
  } from 'semantic-ui-react';
import React, { useState } from 'react';
import ResumeCard from './ResumeCard';
import moment from 'moment';
function Applicant(props){
    var applicant = props.applicant;
    console.log(applicant)
    const [view, setView] = useState(false);
    return(
        <Card  fluid>
                
                <Card.Content>
                    <Card.Header>{applicant.username}
                    <Button
                    as="div"
                    color="blue"
                    floated="right"
                    onClick={()=>{
                     setView(!view);
                    }}
                    >
                   
                     {view && <div>View less</div>}
                     {!view && <div>View more</div>} 
                    </Button>
                    </Card.Header>
                    <Card.Meta >submitted {moment(applicant.submittedAt).fromNow(true)} ago</Card.Meta>
                    <Card.Description>
                      {view && <ResumeCard resume={JSON.parse(applicant.resume)}></ResumeCard>}
                        
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a href={`${applicant.originalFile}`}>
                 
                    <Button
                      as="div"
                      color="blue"
                      floated="right"
                    >View Original File</Button>
                  </a>
                </Card.Content>
                
        </Card>
        
    )
}

export default Applicant;