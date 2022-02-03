import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expireTime) {
  return Cookies.set(TokenKey, token, {
    expires: new Date(expireTime)
  })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
