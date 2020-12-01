import React,{useState, useEffect, useContext} from 'react';
import {  Grid, Transition } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import useDebounce from '../util/use-debounce';
import { BsSearch } from "react-icons/bs";

function Home() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  //const [filter, setFilter] = useState();
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
       
          <div className="field is-grouped" style={styles.input}>
              <div className="control">
                  <div className="select">
                      <select>
                         
                          <option >All posts</option>
                          <option default>Posted by you</option>
                      </select>
                  </div>
              </div>

 
          </div>
     
      <h1>Recent job posts:</h1>
      </Grid.Row>
      <Grid.Row>
        {isSearching ? (
          <h1>Loading...</h1>
        ) : (
          <Transition.Group>
             

            {results &&
              results.map((jobPost) => (
                <Grid.Column key={jobPost._id} style={{ marginBottom: 20 }}>
                  {console.log(jobPost._id)}
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