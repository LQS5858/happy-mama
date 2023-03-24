

export default {
  namespaced: true,
  state: {
    registerInfo: {},
    userRoles: []
  },
  mutations: {
    SAVE_REGISTERINFO (state, data) {
      state.registerInfo = data
      console.log('commit~~', data, state);
    },
    CLEAR_LOGIN_INFO (state) {
      state.registerInfo = {}
      uni.removeStorageSync('userRoles')
      uni.removeStorageSync('token');
    },
    SAVE_USERROLES (state, data) {
      state.userRoles = data
    }
  },
  getters: {
    token (state) {
      return state?.registerInfo?.token
    }
  }
}