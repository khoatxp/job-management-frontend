import React,{useState, useEffect, useContext} from 'react';
import {  Grid, Transition, Button } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import useDebounce from '../util/use-debounce';
import { BsSearch } from "react-icons/bs";
import Pagination from "react-js-pagination";

function Home() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(search, 500);
  useEffect(
    () => {  
        setIsSearching(true);
        searchCharacters(debouncedSearchTerm).then(results => {
        setIsSearching(false);
        
        if(user && filter){
          setResults(results.filter((p)=>p.username === user.username))
        }
        else{
          setResults(results)
        }
      });
    
    },
    [debouncedSearchTerm, filter,user]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const jobPostsPerPage = 6;
  const indexOfLastJobPost = currentPage * jobPostsPerPage;
  const indexOfFirstJobPost = indexOfLastJobPost - jobPostsPerPage;
  const currentJobPosts = results.slice(indexOfFirstJobPost, indexOfLastJobPost)
  const handlePageChange = ( pageNumber ) => {
    setCurrentPage( pageNumber )
 };

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
        <div className="form-container">
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
         
             <>

            { currentJobPosts &&
              currentJobPosts.map((jobPost) => (
                <Grid.Column key={jobPost._id} style={{ marginBottom: 20 }}>
                  <PostCard jobPost={jobPost} />
                </Grid.Column>
              ))}
        </>
         
        )}
      </Grid.Row>
    </Grid>
    <Grid.Row>
      <div className="center">
        <div className="pagination">
            <Pagination
               activePage={ currentPage }
               itemsCountPerPage={ 6 }
               totalItemsCount={ results.length }
               pageRangeDisplayed={ 4 }
               onChange={ handlePageChange }
               
            />
         </div>
      </div>
    </Grid.Row>

    </div>
  );
}
function searchCharacters(search) {
  return fetch(
    ` https://searchservice-pvwu2w75ta-uw.a.run.app/jobPosting?query=${search}&queryLimit=100`,
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