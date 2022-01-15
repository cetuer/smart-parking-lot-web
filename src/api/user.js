import request from "@/utils/request.js"

// 登录
export function login(username, password, code, uuid) {
    return request({
        url: '/parking-auth/auth/login',
        method: 'post',
        data: { username, password, code, uuid }
    })
}

//获取验证码
export function getCodeImg() {
    return request({
        url: '/code',
        method: 'get',
        timeout: 20000
    })
}