import request from "@/utils/request.js"
// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/parking-admin/notice/listByPage',
    method: 'get',
    params: query
  })
}

// 新增公告
export function add(data) {
  return request({
    url: '/parking-admin/notice/add',
    method: 'post',
    data: data
  })
}

// 根据id获取公告信息
export function getNotice(noticeId) {
  return request({
    url: '/parking-admin/notice/getNotice/' + noticeId,
    method: 'get'
  })
}

// 修改公告
export function update(data) {
  return request({
    url: '/parking-admin/notice/update',
    method: 'put',
    data: data
  })
}

// 删除公告
export function del(id) {
  return request({
    url: '/parking-admin/notice/del/' + id,
    method: 'delete'
  })
}