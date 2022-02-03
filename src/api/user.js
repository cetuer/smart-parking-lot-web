import request from "@/utils/request.js"

// 登录
export function login(username, password, code, uuid) {
  return request({
    url: '/parking-auth/auth/login',
    method: 'post',
    headers: {
      isToken: false
    },
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}

//获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    method: 'get',
    headers: {
      isToken: false
    },
    timeout: 20000
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/parking-admin/user/getInfo',
    method: 'get'
  })
}

// 登出
export function logout() {
  return request({
    url: '/parking-auth/auth/logout',
    method: 'delete'
  })
}
