import {observable, action} from 'mobx'
import uitls from '../assets/js/utils'

class AppStore {
  @observable isLogin = !!uitls.getCookies('sessionId')  //利用cookie来判断用户是否登录，避免刷新页面后登录状态丢失
  @observable pathMenus = []  //菜单
  @observable authButton = []  //按钮权限
  @observable loginUser = {}  // 登录用户信息
  @observable authority = true  //当前路由权限
  @observable breadcrumb = []  //面包屑
  @observable path = "dashboard"  //路径

  @action toggleLogin(flag,info={}) {
    if (flag) {
      uitls.setCookies('sessionId',info.result.token)
      uitls.setCookies('userinfo',info.result.psOpsUser)
      this.loginUser = info.result.psOpsUser  //设置登录用户信息
      this.isLogin = true
    } else {
      this.isLogin = false
      uitls.removeCookies('sessionId')
      uitls.removeCookies('userinfo')
    }
  }
  @action initMenus(item) {
    this.pathMenus = item
  }
  @action menusAuthority(fg) {
    this.authority = fg
  }
  @action buttonAuthority(item) {
    this.authButton = item
  }
  @action breadcrumbList(item) {
    this.breadcrumb = item
  }
  @action setpath(item) {
    this.path = item
  }
}

export default new AppStore()