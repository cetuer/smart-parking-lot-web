import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    tagsView,
    permission,
    settings,
    user
  },
  getters
})

export default store
