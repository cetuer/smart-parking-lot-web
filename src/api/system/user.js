import request from "@/utils/request.js"
import {
  praseStrEmpty
} from "@/utils/cetuer";

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

// 登出
export function logout() {
  return request({
    url: '/parking-auth/auth/logout',
    method: 'delete'
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/parking-admin/user/getInfo',
    method: 'get'
  })
}

// 查询用户列表
export function listUserByPage(query) {
  return request({
    url: '/parking-admin/user/listByPage',
    method: 'get',
    params: query
  })
}

// 查询用户详情
export function getUser(id) {
  return request({
    url: '/parking-admin/user/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/parking-admin/user/add',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/parking-admin/user/edit',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(ids) {
  return request({
    url: '/parking-admin/user/' + ids,
    method: 'delete'
  })
}

// 检查用户名是否唯一
export function checkUsernameUnique(username) {
  return request({
    url: '/parking-admin/user/check/' + username,
    method: 'get'
  })
}

// 重置密码
export function resetUserPwd(id, password) {
  const data = {
    id,
    password
  }
  return request({
    url: '/parking-admin/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 更新用户与角色关系
export function updateUserRole(data) {
  return request({
    url: '/parking-admin/user/updateUserRole',
    method: 'put',
    params: data
  })
}
