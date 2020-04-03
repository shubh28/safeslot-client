import axios from 'axios';
import * as Endpoints from '../common/endpoints';
import { getPostForId } from './story';

export const addComment = (post_id, description) => dispatch => {
  axios
    .post(Endpoints.ADD_COMMENT_URL(post_id), { description })
    .then(res => {
      window.location.reload();
    })
    .catch(err => {
      window.location.reload();
    });
};

export const deleteComment = (post_id, comment_id) => dispatch => {
  axios
    .delete(Endpoints.UPDATE_COMMENT_URL(comment_id))
    .then(res => {
      dispatch(getPostForId(post_id));
    })
    .catch(err => {
      alert('You are not allowed to delete this comment');
    });
};

export const editComment = (post_id, comment_id, description) => dispatch => {
  axios
    .patch(Endpoints.UPDATE_COMMENT_URL(comment_id), { description })
    .then(res => {
      dispatch(getPostForId(post_id));
    })
    .catch(err => {
      alert('you cannot edit this answer');
    });
};
