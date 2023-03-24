import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

import basic from './modules/basic'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    basic
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => uni.getStorageSync(key), // 获取  
        setItem: (key, value) => uni.setStorageSync(key, value), // 存储  
        removeItem: (key) => uni.removeStorageSync(key) // 删除  
      }
    })
  ]
})

export default store