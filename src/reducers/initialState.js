const initState = {
  userAuthenticationDetails: {
    isFetching: false,
    data: {
      email: '',
      isProfileCompleted: '',
      token: '',
      isLoggedIn: false
    },
    error: {}
  },
  userProfileReducer: {
    getUserProfile: {
      isFetching: false,
      data: {},
      error: {}
    },
    createUserProfile: {
      isFetching: false,
      data: {},
      error: {}
    }
  },
  mentorsReducer: {
    isFetching: false,
    data: [],
    error: {}
  }
};

export default initState;
