/**
 * v-permission 操作权限处理
 */
import store from '@/store'

/**
 * 检查权限，拥有其中一个即可检查通过
 */
function checkPermission(el, binding) {
  const {
    value
  } = binding
  const all_permission = "*:*:*";
  const permissions = store.getters && store.getters.permissions
  //管理员拥有所有权限
  if(permissions.includes(all_permission)) {
    return
  }
  if (value && value instanceof Array && value.length > 0) {
    const needPermission = value
    const hasPermission = permissions.some(permission => {
      return needPermission.includes(permission)
    })
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error('请设置操作权限标签值')
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
