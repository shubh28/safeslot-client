export const API_HOST = 'http://localhost:7000';
export const API_PATH = '/api/v1';
export const LOGIN_URL = `${API_PATH}/login`;
export const SIGN_UP_URL = `${API_PATH}/signup`;
export const PROFILE_URL = `${API_PATH}/profile`;
export const MENTORS_URL = `${API_PATH}/mentors`;
export const ADD_COMMENT_URL = post_id =>
  `${API_HOST}${API_PATH}/post/${post_id}/comment`;
export const UPDATE_COMMENT_URL = comment_id =>
  `${API_HOST}${API_PATH}/comment/${comment_id}`;
export const USER_PROFILE_URL = request => {
  let { id } = request;
  return `${API_PATH}/user/${id}`;
};
export const POSTS_URL = searchTerm => {
  const url = `${API_HOST}${API_PATH}/posts`;
  return searchTerm ? `${url}?includes=asked_by,answers&q=${searchTerm}` : url;
};
export const COMMENTS_URL = request => {
  const { questionId, answerId } = request;
  if (answerId) {
    return `${API_HOST}${API_PATH}/questions/${questionId}/answers/${answerId}/comments`;
  }
  return `${API_HOST}${API_PATH}/questions/${questionId}/comments`;
};
