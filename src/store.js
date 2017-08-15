/**
 * Created by Administrator on 2017/8/14.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cover: false
  },
  getters: {
    cover (state) {
      return state.cover
    }
  },
  mutations: {
    toggleCover (state) {
      // console.log(state.cover, 'toggleCover')
      state.cover = !state.cover
    }
  }
})
