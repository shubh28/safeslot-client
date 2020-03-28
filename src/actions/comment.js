import axios from 'axios';
import {API_URL} from "../consts";
import {getPostForId} from "./story";

export const addComment = (post_id, description) => dispatch => {
  axios.post(`${API_URL}/post/${post_id}/comment`, {description})
    .then(res => {
      window.location.reload()
    })
    .catch(err => {
      window.location.reload()
    })
};

export const deleteComment = (post_id, comment_id) => dispatch =>{

  axios.delete(`${API_URL}/comment/${comment_id}`)
    .then(res => {
      dispatch(getPostForId(post_id));
    })
    .catch(err => {
      alert('You are not allowed to delete this comment');
    })

};

export const editComment = (post_id, comment_id, description) => dispatch => {
  axios.patch(`${API_URL}/comment/${comment_id}`, {description})
    .then(res => {
      dispatch(getPostForId(post_id));
    })
    .catch(err => {
      alert('you cannot edit this answer');
    })
};
