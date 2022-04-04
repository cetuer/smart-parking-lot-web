import request from "@/utils/request.js"

// 获取所有停车场
export function listParking(query) {
  return request({
    url: '/parking-admin/parkingLot/listByPage',
    method: 'get',
    params: query
  })
}

// 新增停车场
export function add(data) {
  return request({
    url: '/parking-admin/parkingLot/add',
    method: 'post',
    data: data
  })
}

// 根据id获取停车场信息
export function getParking(parkingId) {
  return request({
    url: '/parking-admin/parkingLot/getParking/' + parkingId,
    method: 'get'
  })
}

// 修改停车场
export function update(data) {
  return request({
    url: '/parking-admin/parkingLot/update',
    method: 'put',
    data: data
  })
}

// 删除停车场
export function del(id) {
  return request({
    url: '/parking-admin/parkingLot/del/' + id,
    method: 'delete'
  })
}