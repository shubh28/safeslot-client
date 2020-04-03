import axios from 'axios';

import * as Endpoints from '../common/endpoints';
import { GET_ALL_POSTS, GET_POST_DETAIL } from '../common/consts';

function emitAllPosts(data) {
  return {
    type: GET_ALL_POSTS,
    payload: data
  };
}

export const getAllPosts = searchTerm => dispatch => {
  axios.get(Endpoints.POSTS_URL(searchTerm)).then(res => {
    dispatch(emitAllPosts(res.data));
  });
};

function emitPostDetails(data) {
  return {
    type: GET_POST_DETAIL,
    payload: data
  };
}

export const getPostForId = id => dispatch => {
  axios.get(Endpoints.POSTS_URL()).then(res => {
    dispatch(emitPostDetails(res.data));
  });
};

export const deletePost = (id, history) => dispatch => {
  axios
    .delete(Endpoints.POSTS_URL())
    .then(res => {
      history.push('/');
    })
    .catch(err => {
      alert('You dont have permissions to delete this question');
    });
};

export const addPost = (title, description, history) => dispatch => {
  axios
    .post(Endpoints.POSTS_URL(), { title, description })
    .then(res => {
      history.push(`/story/${res.data.post_id}`);
    })
    .catch(err => {
      alert('Please login to add question');
      history.push('/login');
    });
};

export const editPost = (id, title, description, history) => dispatch => {
  axios
    .patch(Endpoints.POSTS_URL(), { title, description })
    .then(res => {
      history.push(`/story/${res.data.post_id}`);
    })
    .catch(err => {
      alert('Sorry you are not authorized to edit this story');
    });
};

export const addComment = (questionId, description, answerId) => dispatch => {
  axios
    .post(Endpoints.COMMENTS_URL({ questionId, answerId }), { description })
    .then(res => {
      dispatch(getPostForId(questionId));
    })
    .catch(err => {
      alert('Some error while adding comment');
    });
};
