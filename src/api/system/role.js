import request from "@/utils/request.js"
import {
  praseStrEmpty
} from "@/utils/cetuer";

// 用户id获取所有角色列表
export function listRole(userId) {
  return request({
    url: '/parking-admin/role/list/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 分页查询角色列表
export function listRoleByPage(query) {
  return request({
    url: '/parking-admin/role/listByPage',
    method: 'get',
    params: query
  })
}

// 检查角色名是否唯一
export function checkRoleNameUnique(roleName) {
  return request({
    url: '/parking-admin/role/check/' + roleName,
    method: 'get'
  })
}

// 增加角色
export function addRole(data) {
  return request({
    url: '/parking-admin/role',
    method: 'post',
    data: data
  })
}