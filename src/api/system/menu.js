import request from "@/utils/request.js"

// 获取路由
export function getRouters() {
  return request({
    url: '/parking-admin/menu/getRouters',
    method: 'get'
  })
}

//查询菜单列表
export function listMenu(query) {
  return request({
    url: '/parking-admin/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单下拉树结构
export function treeSelect() {
  return request({
    url: '/parking-admin/menu/treeSelect',
    method: 'get'
  })
}
