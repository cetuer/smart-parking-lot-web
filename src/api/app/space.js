import request from "@/utils/request.js"

// 删除停车场下所有停车位
export function delAll(id) {
  return request({
    url: '/parking-admin/parkingSpace/delAll/' + id,
    method: 'delete'
  })
}

// 查找所有车位
export function listSpace(query) {
  return request({
    url: '/parking-admin/parkingSpace/listByPage',
    method: 'get',
    params: query
  })
}

// 新增车位
export function add(data) {
  return request({
    url: '/parking-admin/parkingSpace/add',
    method: 'post',
    data: data
  })
}

// 根据id获取车位信息
export function getSpace(spaceId) {
  return request({
    url: '/parking-admin/parkingSpace/getSpace/' + spaceId,
    method: 'get'
  })
}

// 修改车位
export function update(data) {
  return request({
    url: '/parking-admin/parkingSpace/update',
    method: 'put',
    data: data
  })
}

// 删除车位
export function del(id) {
  return request({
    url: '/parking-admin/parkingSpace/del/' + id,
    method: 'delete'
  })
}
