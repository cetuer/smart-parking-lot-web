import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/cetuer.scss' // cetuer css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins

import '@/assets/icons' // icon
import '@/permission' // permission control

import {
  resetForm
} from "@/utils/cetuer";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"

// 全局方法挂载
Vue.prototype.resetForm = resetForm

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(ElementUI)
Vue.use(directive)
Vue.use(plugins)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
