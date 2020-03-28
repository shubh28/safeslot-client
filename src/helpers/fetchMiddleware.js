import {loadState} from "../helpers/LocalStorage";

const fetchMiddleware = store => next => action => {

  if (!action || !action.fetchConfig) {
    return next(action);
  }

  const dispatch = store.dispatch;
  const config = action.fetchConfig;
  const localStore = loadState('userAuthenticationDetails');

  const host = config.host;
  const path = config.path;
  const method = config.method;
  const body = method === 'POST' || method === 'PATCH' ? JSON.stringify(config.body): null;
  const successHandler = config.success;
  const failureHandler = config.failure;

  let url = host + path;

  const fetchData = {
    method,
  };

  if (body) {
    fetchData.body = body;
  }

  fetchData.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': localStore ? `${localStore.token}`:null
  };

  let promiseResolve, promiseReject;
  const promise = new Promise((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  fetch(url, fetchData)
    .then(response => {
      if (response.ok) {
        response
          .json()
          .then(data => {
            dispatch(successHandler(data, config, store.getState()));
            promiseResolve();
          })
          .catch(error => {
            dispatch(failureHandler(error, config, store.getState()));
            promiseReject();
          })
      } else {
        response
          .json()
          .then(data => {
            const newData = {...data, statusCode: response.status};
            dispatch(failureHandler(newData, config, store.getState()));
            promiseResolve();
          })
          .catch(error => {
            dispatch(failureHandler(error, config, store.getState()));
            promiseReject();
          })
      }
    })
    .catch(error => {
      dispatch(failureHandler(error, config, store.getState()));
      promiseReject();
    });

  return promise;

};

export default fetchMiddleware;
