import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
Vue.config.productionTip = false
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// axios.defaults.baseURL = 'http://118.31.171.210:8801/api/private/v1/'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// request拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// response拦截器
axios.interceptors.response.use(config => {
  // console.log(config)
  Nprogress.done()
  return config
})

Vue.prototype.$http = axios
Vue.component('tree-table',TreeTable)

// 日期转换
Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 全局注册
Vue.use(VueQuillEditor)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
