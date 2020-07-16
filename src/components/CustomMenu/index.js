import React from 'react'
import {Link,withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'
import { inject, observer} from 'mobx-react'
import {toJS} from "mobx"
import uitls from "../../assets/js/utils"


const SubMenu = Menu.SubMenu;
//此组件的意义就是将数据抽离出来，通过传递数据去渲染
@withRouter @inject('appStore') @observer
class CustomMenu extends React.Component {
  state = {
    openKeys: [],
    selectedKeys: []
  }

  componentDidMount() {
    // console.log("22",this.props.menus)
    // 防止页面刷新侧边栏又初始化了
    const pathname = this.props.location.pathname
    //获取当前所在的目录层级
    const rank = pathname.split('/')
    switch (rank.length) {
      case 2 :  //一级目录
        this.setState({
          selectedKeys: [pathname]
        })
        break;
      case 5 : //三级目录，要展开两个subMenu
        this.setState({
          selectedKeys: [pathname],
          openKeys: [rank.slice(0, 3).join('/'), rank.slice(0, 4).join('/')]
        })
        break;
      case 4 :
        let lastpath = pathname.substr(0, pathname.lastIndexOf('/'))
        this.setState({
          selectedKeys: [pathname.substr(0, pathname.lastIndexOf('/'))],
          openKeys: [lastpath.substr(0, lastpath.lastIndexOf('/'))]
        })
        break;
      default :
        this.setState({
          selectedKeys:[pathname],
          openKeys: [pathname.substr(0, pathname.lastIndexOf('/'))]
        })
    }
    if(rank.length === 2){
      this.props.appStore.breadcrumbList([])
    }
    this.getPathMenus(rank)
  }
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return
    }
  }
  getPathMenus(rank){
    var time = null
    const pathMenus = toJS(this.props.appStore.pathMenus)
    if(pathMenus.length > 0){
      clearTimeout(time)
      if(rank.length > 0  && rank[1]){
        this.menuRoutes(pathMenus,rank)
      }
      return
    } 
    time = setTimeout(()=>{
      this.getPathMenus(rank)
    },500)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    //当点击面包屑导航时，侧边栏要同步响应
    const pathMenus = toJS(nextProps.appStore.pathMenus)
    const pathname = nextProps.location.pathname
    const ranks = pathname.split('/')
    this.props.appStore.setpath(ranks[2])
    uitls.setCookies('pathname',ranks[2])
    if(ranks.length > 2 && pathMenus.length > 0){
      this.menuRoutes(pathMenus,ranks)
    }
    if(ranks.length === 2){
      this.props.appStore.breadcrumbList([])
    }
    if (this.props.location.pathname !== pathname && !pathname.includes(this.props.location.pathname)) {
      const rank = pathname.split('/')
      switch (rank.length) {
        case 2 :  //一级目录
          this.setState({
            selectedKeys: [pathname]
          })
          break;
        case 5 : //三级目录，要展开两个subMenu
          this.setState({
            selectedKeys: [pathname],
            openKeys: [rank.slice(0, 3).join('/'), rank.slice(0, 4).join('/')]
          })
          break;
        case 4 : // 二级目录
          let lastpath = pathname.substr(0, pathname.lastIndexOf('/'))
          this.setState({
            selectedKeys: [pathname.substr(0, pathname.lastIndexOf('/'))],
            openKeys: [lastpath.substr(0, lastpath.lastIndexOf('/'))]
          })
          break;
        default :
          this.setState({
            selectedKeys:[pathname],
            openKeys: [pathname.substr(0, pathname.lastIndexOf('/'))]
          })
        }
    }
  }

  onOpenChange = (openKeys) => {
    //此函数的作用只展开当前父级菜单（父级菜单下可能还有子菜单）
    if (openKeys.length === 0 || openKeys.length === 1) {
      this.setState({
        openKeys
      })
      return
    }

    //最新展开的菜单
    const latestOpenKey = openKeys[openKeys.length - 1]
    if (latestOpenKey.includes(openKeys[0])) {
      this.setState({
        openKeys
      })
    } else {
      this.setState({
        openKeys: [latestOpenKey]
      })
    }
  }

  renderMenu=(data)=>{
    const { appStore } = this.props
    let path = uitls.getCookies('pathname') 
    return data.map((item)=>{
      const fromPath = item.key.split('/')
      return <div className={item.class} key={item.key}><li className={`ant-menu-item ${path==fromPath[2]? "ant-menu-item-selected" : ""}`} role="menuitem" style={{paddingLeft: "24px"}}>
      <a href={"#"+item.key}>
        <i className={`iconfont ${item.icon}`} style={{fontSize:"18px",marginRight:"5px"}}></i> 
      <span>{item.title}</span></a></li></div>
    })
    
  }
  getDetailById = (obj, rank) => {
    for (let item of obj) {
      if (rank.join('/').includes(item.key)) {
        if(item.key === rank.join('/')){
          return item
        } else if (item && item.subs && item.subs.length > 0) {
          const temp = this.getDetailById(item.subs, rank)
          if (temp) {
            return temp
          }
        } else if (item.key !== rank.join('/')){
          return []
        } else {
          return item
        }
      }
      
    }
  }
  menuRoutes = (pathMenus,rank)=>{
    let data= this.getDetailById(pathMenus,rank)
    if(data) {
      this.props.appStore.menusAuthority(true)
      let arr = []
      for(let i =rank.length;i>1;i--){
        let path = rank.slice(0,i)
        let val = this.getDetailById(pathMenus,path)
        if(val){
          let obj = {
            title:val.title || '',
            to: i >=3 ? i === rank.length ? '' :  val.key :''
          }
          arr.unshift(obj)
        }
      } 
      this.props.appStore.breadcrumbList(arr)
      data.button ? this.props.appStore.buttonAuthority(data.button) : this.props.appStore.buttonAuthority([])
    } else {
      this.props.appStore.menusAuthority(false) 
    }
   
    if(!this.props.appStore.authority){
      this.props.history.push('/noAuthority')
    }
  }
  render() {
    const {openKeys, selectedKeys} = this.state
    const defaultProps = this.props.collapsed ? {} : { openKeys }
  
    return (
      <Menu
        onOpenChange={this.onOpenChange}
        onClick={({key}) => {this.setState({selectedKeys: [key]})}}
        {...defaultProps}
        selectedKeys={selectedKeys}
        mode='inline'>
        {
          this.renderMenu(this.props.menus)
        }
      </Menu>
    )
  }
}

export default CustomMenu