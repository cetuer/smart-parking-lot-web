import request from "@/utils/request.js"

// 登录
export const login = data => {
    return request({
        url: '/parking-auth/auth/login',
        method: 'post',
        data: data
    })
}