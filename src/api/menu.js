import request from "@/utils/request.js"

// 获取路由
export const getRouters = () => {
    return request({
        url: '/service-menu/menu/getRouters',
        method: 'get'
    })
}

//查询菜单列表
export function listMenu(query) {
    return request({
        url: '/service-menu/menu/list',
        method: 'get',
        params: query
    })
}