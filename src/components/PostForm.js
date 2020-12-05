import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: '',company:'',salary:'', title:'', location:''
  });
  let history = useHistory();
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      const jobPost = result.data.createJobPost;
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getJobPosts: [jobPost, ...data.getJobPosts] }
    });
      values.body = '';
      values.company = '';
      values.salary = '';
      values.title = '';
      values.location = '';
    }
  });

  function createPostCallback() {
    createPost();
    
    history.push('/');
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h1 className="page-title">Create a job post:</h1>
        <Form.Field>
          <Form.Input
            placeholder="Job title"
            name="title"
            onChange={onChange}
            value={values.title}
            error={error ? true : false}
          />
          <Form.Input
            placeholder="Company name"
            name="company"
            onChange={onChange}
            value={values.company}
            error={error ? true : false}
          />
          <Form.Input
            placeholder="Estimated salary"
            name="salary"
            onChange={onChange}
            value={values.salary}
            error={error ? true : false}
          />
          <Form.Input
            placeholder="Company location"
            name="location"
            onChange={onChange}
            value={values.location}
            error={error ? true : false}
          />
          <Form.TextArea
            placeholder="Description of job"
            rows="25"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button floated="center-center" type="submit" primary>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createJobPost($body: String!, $company: String!, $salary: String!, $title:String!, $location:String!) {
    createJobPost(body: $body, company: $company , salary: $salary , title: $title , location: $location) {
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

export default PostForm;