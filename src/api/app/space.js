import request from "@/utils/request.js"

// 删除停车场下所有停车位
export function delAll(id) {
  return request({
    url: '/parking-admin/parkingSpace/delAll/' + id,
    method: 'delete'
  })
}
