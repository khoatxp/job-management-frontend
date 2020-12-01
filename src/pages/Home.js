import React,{useState, useEffect, useContext} from 'react';
import {  Grid, Transition, Button } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import useDebounce from '../util/use-debounce';
import { BsSearch } from "react-icons/bs";

function Home() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(search, 500);
  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
     
        // Set isSearching state
        setIsSearching(true);
        // Fire off our API call
        searchCharacters(debouncedSearchTerm).then(results => {
        // Set back to false since request finished
        setIsSearching(false);
        // Set results state
        setResults(results);
      });
    
    },
    [debouncedSearchTerm]
  );
  useEffect(
    ()=>{
      if(!user && filter){
        setFilter(false);
      }
    },[filter,user]
  )
  

  return (
    <div>
    <Grid columns={2}>
      <Grid.Row className="page-title">
        <BsSearch/>
        <input
            style={styles.input}
            onChange = {(e)=>{
              setSearch(e.target.value);
            }}
            value={search}
            placeholder='Search for job posts'
        />
      </Grid.Row>
      <Grid.Row className="page-title">
      {user && 
        <div class="form-container">
          <Button
          primary
          floated="left"
          onClick={() => setFilter(false)}
          >
          All posts
          </Button>
          <Button
          secondary
          floated="right"
          onClick={() => setFilter(true)}
          >
          Posted by you
          </Button>
        </div>
          
      }
      </Grid.Row>
          
      <Grid.Row className="page-title">
        <h1>Recent job posts:</h1>
      </Grid.Row>
      <Grid.Row>
        {isSearching ? (
          <h1>Loading...</h1>
        ) : (
          <Transition.Group>
             

            {!filter && results &&
              results.map((jobPost) => (
                <Grid.Column key={jobPost._id} style={{ marginBottom: 20 }}>
                  <PostCard jobPost={jobPost} />
                </Grid.Column>
              ))}
            {filter && results && user && results.map((jobPost) => (
                <>
                {user.username === jobPost.username && 
                  <Grid.Column key={jobPost._id} style={{ marginBottom: 20 }}>
                  <PostCard jobPost={jobPost} />
                </Grid.Column>
                }
                
                </>
              )) }
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
    </div>
  );
}
function searchCharacters(search) {
  return fetch(
    ` https://searchservice-vbryqcvj2a-uw.a.run.app/jobPosting?query=${search}`,
    {
      method: 'GET'
    }
  )
    .then(res => res.json())
    .then(res => res.records)
    .catch(error => {
      console.error(error);
      return [];
    });
}

const styles = {
  input: {
    height: 40,
    width: 300,
    padding: 7,
    fontSize: 15,
    outline: 'none',
    alignItems: "center",
  }
}


export default Home;