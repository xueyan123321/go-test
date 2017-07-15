// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import go from 'gojs'
import iView from 'iview'
import taskTree from './components/taskTree'
import 'iview/dist/styles/iview.css'
import scriptsTree from './components/scriptsTree'
import resourceManager from './components/resourceManager'
import VueRouter from 'vue-router'

Object.defineProperty(Vue.prototype, '$go', {value: go})
Vue.use(iView)
Vue.use(VueRouter)

Vue.config.productionTip = false
const routes = [
  {path: '/taskTree', component: taskTree},
  {path: '/scriptsTree', component: scriptsTree},
  {path: '/resourceManger', component: resourceManager}
]

const router = new VueRouter({
  routes
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
