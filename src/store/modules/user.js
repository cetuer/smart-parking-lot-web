import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const { username, password, code, uuid } = userInfo
      return new Promise((resolve, reject) => {
        login(username.trim(), password, code, uuid).then(response => {
          const { data } = response
          commit('SET_TOKEN', data.access_token)
          setToken(data.access_token, data.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          const { name, avatar } = data
          if (response.roles && response.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', response.roles)
            commit('SET_PERMISSIONS', response.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出系统
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          removeToken() // must remove  token  first
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // remove token
    ResetToken({ commit }) {
      return new Promise(resolve => {
        removeToken() // must remove  token  first
        commit('RESET_STATE')
        resolve()
      })
    }
  }
}

export default user