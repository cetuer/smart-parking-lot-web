import request from "@/utils/request.js"

// 查询会员列表
export function listMemberByPage(query) {
  return request({
    url: '/parking-admin/member/listByPage',
    method: 'get',
    params: query
  })
}

// 查询会员详情
export function getMember(id) {
  return request({
    url: '/parking-admin/member/' + id,
    method: 'get'
  })
}

// 添加会员
export function addMember(data) {
  return request({
    url: '/parking-admin/member/add',
    method: 'post',
    data: data
  })
}

// 修改会员
export function updateMember(data) {
  return request({
    url: '/parking-admin/member/edit',
    method: 'put',
    data: data
  })
}

// 删除会员
export function delMember(ids) {
  return request({
    url: '/parking-admin/member/' + ids,
    method: 'delete'
  })
}

// 检查用户名是否唯一
export function checkUsernameUnique(username) {
  return request({
    url: '/parking-admin/member/check/' + username,
    method: 'get'
  })
}

// 重置密码
export function resetMemberPwd(id, password) {
  const data = {
    id,
    password
  }
  return request({
    url: '/parking-admin/member/resetPwd',
    method: 'put',
    data: data
  })
}
