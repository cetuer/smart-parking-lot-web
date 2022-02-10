import {
  Message,
  MessageBox,
  Notification,
  Loading
} from 'element-ui'

let loadingInstance;
let defaultTitle = '系统提示';

export default {
  // 消息提示
  msg(content) {
    Message.info(content)
  },
  // 错误消息
  msgError(content) {
    Message.error(content)
  },
  // 成功消息
  msgSuccess(content) {
    Message.success(content)
  },
  // 警告消息
  msgWarning(content) {
    Message.warning(content)
  },
  // 弹出提示
  alert(content, title = defaultTitle) {
    MessageBox.alert(content, title)
  },
  // 错误提示
  alertError(content, title = defaultTitle) {
    MessageBox.alert(content, title, {
      type: 'error'
    })
  },
  // 成功提示
  alertSuccess(content, title = defaultTitle) {
    MessageBox.alert(content, title, {
      type: 'success'
    })
  },
  // 警告提示
  alertWarning(content, title = defaultTitle) {
    MessageBox.alert(content, title, {
      type: 'warning'
    })
  },
  // 通知提示
  notify(content) {
    Notification.info(content)
  },
  // 错误通知
  notifyError(content) {
    Notification.error(content);
  },
  // 成功通知
  notifySuccess(content) {
    Notification.success(content)
  },
  // 警告通知
  notifyWarning(content) {
    Notification.warning(content)
  },
  // 确认窗体
  confirm(content, title = defaultTitle) {
    return MessageBox.confirm(content, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: "warning",
    })
  },
  // 打开遮罩层
  loading(content) {
    loadingInstance = Loading.service({
      lock: true,
      text: content,
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    })
  },
  // 关闭遮罩层
  closeLoading() {
    loadingInstance.close();
  }
}
