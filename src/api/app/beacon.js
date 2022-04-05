import request from "@/utils/request.js"

// 删除停车场下所有蓝牙信标
export function delAll(id) {
  return request({
    url: '/parking-admin/beacon/delAll/' + id,
    method: 'delete'
  })
}

// 获取所有信标
export function listBeacon(query) {
  return request({
    url: '/parking-admin/beacon/listByPage',
    method: 'get',
    params: query
  })
}

// 新增信标
export function add(data) {
  return request({
    url: '/parking-admin/beacon/add',
    method: 'post',
    data: data
  })
}

// 根据id获取信标信息
export function getBeacon(beaconId) {
  return request({
    url: '/parking-admin/beacon/getBeacon/' + beaconId,
    method: 'get'
  })
}

// 修改信标
export function update(data) {
  return request({
    url: '/parking-admin/beacon/update',
    method: 'put',
    data: data
  })
}

// 删除信标
export function del(id) {
  return request({
    url: '/parking-admin/beacon/del/' + id,
    method: 'delete'
  })
}
