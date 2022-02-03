import defaultSettings from '@/settings'

const {
  showSettings,
  fixedHeader,
  sidebarLogo
} = defaultSettings

const state = {
  title: '',
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, {
    key,
    value
  }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  // 修改布局设置
  changeSetting({
    commit
  }, data) {
    commit('CHANGE_SETTING', data)
  },
  // 设置网页标题
  setTitle({
    commit
  }, title) {
    state.title = title
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
