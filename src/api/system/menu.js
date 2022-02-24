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
    url: '/parking-admin/menu/listByPage',
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

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect(roleId) {
  return request({
    url: '/parking-admin/menu/roleMenuTreeSelect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/parking-admin/menu',
    method: 'post',
    data: data
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/parking-admin/menu/' + menuId,
    method: 'get'
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/parking-admin/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/parking-admin/menu/' + menuId,
    method: 'delete'
  })
}
