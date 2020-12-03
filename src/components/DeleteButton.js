import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

function DeleteButton({ postId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);


  const [deletePostMutation] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
      setConfirmOpen(false);
      window.location.reload();
    },
    variables: {
      postId
    }
  });
  return (
    <>
      <MyPopup content={'Delete post'}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deleteJobPost(postId: $postId)
  }
`;


export default DeleteButton;