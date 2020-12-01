import React,{useState, useEffect} from 'react';
import { useQuery } from '@apollo/react-hooks';
import {  Grid, Transition } from 'semantic-ui-react';

import PostCard from '../components/PostCard';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import useDebounce from '../util/use-debounce';
import gql from 'graphql-tag';

function Home() {

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(search, 500);
  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedSearchTerm) {
        // Set isSearching state
        setIsSearching(true);
        // Fire off our API call
        searchCharacters(debouncedSearchTerm).then(results => {
          // Set back to false since request finished
          setIsSearching(false);
          // Set results state
          setResults(results);
        });
      } else {
        setResults([]);
      }
    },
    [debouncedSearchTerm]
  );

  

  const {
    loading,
    data: { getJobPosts: jobPosts } = {}
  } = useQuery(FETCH_POSTS_QUERY)
  return (
    <div>
    <Grid columns={2}>
      <Grid.Row className="page-title">
      <input
          style={styles.input}
          onChange = {(e)=>{
            setSearch(e.target.value);
          }}
          value={search}
          placeholder='Search for job posts'
      />
      <h1>Recent job posts:</h1>
      </Grid.Row>
      <Grid.Row>
       
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          <Transition.Group>
             {isSearching && <div>Searching ...</div>}
            {!search && jobPosts &&
              jobPosts.map((jobPost) => (
                <Grid.Column key={jobPost.id} style={{ marginBottom: 20 }}>
                  
                  <PostCard jobPost={jobPost} />
                </Grid.Column>
              ))}
            {search && results &&
              results.map((searchPost) => (
                <Grid.Column key={searchPost.id} style={{ marginBottom: 20 }}>
                  
                  <PostCard jobPost={searchPost} />
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
    `https://jobpostingservice-vbryqcvj2a-uw.a.run.app/jobPosting?query=${search}`,
    {
      method: 'GET'
    }
  )
    .then(r => r.json())
    .then(r => {console.log(r.data.results)})
    .catch(error => {
      console.error(error);
      return [];
    });
}
/*
class Home extends React.Component {
  state = {
    jobPosts: [],
    search: ''
  }
  client = new ApolloClient({
    uri:'http://localhost:8080/'
  });
  updateSearch=(search)=>{
    this.setState({search: search});
    this.requestJobPosts(search);
  }
  componentDidMount() {
    
  }
  requestJobPosts(search){
    this.client.query({
      query: SEARCH_POSTS_QUERY,
    }).then(result=>this.setState({jobPosts:result}))
  }
  render(){
    const { loading } = this.state.jobPosts
    return (
      <div>
      <Grid columns={2}>
        <Grid.Row className="page-title">
        <input
            style={styles.input}
            onChange = {this.updateSearch}
            value={this.state.search}
            placeholder='Search for job posts'
        />
        <h1>Recent job posts:</h1>
        </Grid.Row>
        <Grid.Row>
         
          {loading ? (
            <h1>Loading posts..</h1>
          ) : (
            <Transition.Group>
              
              {this.state.jobPosts &&
                this.state.jobPosts.map((jobPost) => (
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
}
*/
const styles = {
  input: {
    height: 40,
    width: 300,
    padding: 7,
    fontSize: 15,
    outline: 'none'
  }
}

const SEARCH_POSTS_QUERY = gql`
  query($search: String!) {
    searchJobPosts(search: $search) {
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
export default Home;