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

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/parking-admin/role/' + roleId,
    method: 'get'
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/parking-admin/role',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/parking-admin/role/' + roleId,
    method: 'delete'
  })
}

// 分页查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/parking-admin/role/allocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(params) {
  return request({
    url: '/parking-admin/role/cancelAuthUser',
    method: 'put',
    params: params
  })
}

// 分页查询角色未授权用户列表
export function unallocatedList(query) {
  return request({
    url: '/parking-admin/role/unallocatedList',
    method: 'get',
    params: query
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/parking-admin/role/authUsers',
    method: 'put',
    params: data
  })
}