import axios from 'axios';

import {API_URL, GET_ALL_POSTS, GET_POST_DETAIL} from "../consts";

function emitAllPosts(data) {
  return {
    type: GET_ALL_POSTS,
    payload: data
  }
}

export const getAllPosts = (searchTerm) => dispatch => {
  let url;
  if (!searchTerm || searchTerm === '') {
    url = `${API_URL}/posts`;
  } else {
    url = `${API_URL}/posts?includes=asked_by,answers&q=${searchTerm}`
  }
  axios.get(url)
    .then(res => {
      dispatch(emitAllPosts(res.data));
    });
};

function emitPostDetails(data) {
  return {
    type: GET_POST_DETAIL,
    payload: data
  }
}

export const getPostForId = (id) => dispatch => {
  axios.get(`${API_URL}/${id}/posts`)
    .then(res => {
      dispatch(emitPostDetails(res.data));
    });
};

export const deletePost = (id, history) => dispatch => {
  axios.delete(`${API_URL}/${id}/posts`)
    .then(res => {
      history.push('/');
    })
    .catch(err => {
      alert("You dont have permissions to delete this question")
    })
};

export const addPost = (title, description, history) => dispatch => {
  axios.post(`${API_URL}/posts`, {title, description})
    .then(res => {
      history.push(`/story/${res.data.post_id}`);
    })
    .catch(err => {
      alert("Please login to add question");
      history.push('/login');
    })
};

export const editPost = (id, title, description, history) => dispatch => {
  axios.patch(`${API_URL}/${id}/posts`, {title, description})
    .then(res => {
      history.push(`/story/${res.data.post_id}`);
    })
    .catch(err => {
      alert("Sorry you are not authorized to edit this story");
    })
};

export const addComment = (questionId, description, answerId) => dispatch => {
  if (answerId === undefined) {
    axios.post(`${API_URL}/questions/${questionId}/comments`, {description})
      .then(res => {
        dispatch(getPostForId(questionId));
      })
      .catch(err => {
        alert('Some error while adding comment');
      })
  } else {
    axios.post(`${API_URL}/questions/${questionId}/answers/${answerId}/comments`, {description})
      .then(res => {
        dispatch(getPostForId(questionId));
      })
      .catch(err => {
        alert('Some error while adding comment');
      })
  }
};
