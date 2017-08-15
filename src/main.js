// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import go from 'gojs'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import config from './assets/js/config'
import './assets/scss/index.sass'
import store from './store'

Vue.use(VueAxios, axios)

Vue.use(iView)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
window.onbeforeunload = function () {
  return '请您确保保存修改的文档'
}
// 全局变量
Object.defineProperty(Vue.prototype, '$go', {value: go})
Object.defineProperty(Vue.prototype, '$mainUrl', {value: config.mainUrl})
//  设置全局的Axios
Vue.prototype.setAxiosInterceptor = function () {
  //  设置axios拦截器
  this.axios.interceptors.request.use((config) => {
    this.$store.commit('toggleCover')
    return config
  }, (error) => {
    return Promise.reject(error)
  })
  this.axios.interceptors.response.use((response) => {
    this.$store.commit('toggleCover')
    return response
  }, (error) => {
    this.$store.commit('toggleCover')
    return Promise.reject(error)
  })
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})

