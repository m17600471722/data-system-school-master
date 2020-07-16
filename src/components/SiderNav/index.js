import React from 'react'
import CustomMenu from "../CustomMenu/index"
import axios from '../../assets/js/axios'
import api from '../../config/apiConfig'
import Utils from '../../assets/js/utils'
import { inject, observer } from 'mobx-react'
import uitls from '../../assets/js/utils'

const menus = [
    {
      title: '数据仪表盘',
      key: '/center/dashboard',
      icon:"iconshujuyibiaopan1"
    },
    {
      title: '孕校中台',
      key: '/center/shcool',
      icon:"iconyunxiaozhongtai1"
    },
    {
      title: '孕校云课堂',
      key: '/center/classroom',
      icon:"iconyunxiaoyunketang"
    },
    {
      title: '公众号',
      key: '/center/officialAccounts' ,
      icon:"icongongzhonghao",
      class:"bom",
    },
    {
      title: '医院管理',
      key: '/administer/hospital' , 
      icon:"iconyiyuanguanli",
      class:"top",
    },
    {
      title: '视频课程',
      key: '/administer/videocourse' ,
      icon:"iconshipinkecheng"
    },
    {
      title: '直播课程',
      key: '/administer/livecourses',
      icon:"iconzhibokecheng" 
    },
    {
      title: '面授课程',
      key: '/administer/under-line' ,
      icon:"iconmianshoukecheng"
    },
    {
      title: '其他',
      key: '/center/rest' , 
      class:"bom",
      icon:"iconqita-02"
    },
    {
      title: '用户管理',
      key: '/user/userManagement' ,
      icon:"iconyonghuguanli",
      class:"top",
    },
    {
      title: '用户画像',
      key: '/user/userPortrait' ,
      icon:"iconyonghuhuaxiang"
    },
    {
      title: '行为轨迹',
      key: '/user/behaviorTrace' ,
      icon:"iconhangweiguiji"
    },
    {
      title: '用户活跃度',
      key: '/user/liveness' ,
      icon:"iconyonghuhuoyuedu"
    },
    {
      title: '用户留存率',
      key: '/user/retentionRate' ,
      class:"bom",
      icon:"iconyonghuliucun"
    },
    {
      title: '订单管理',
      key: '/system/indent' ,
      icon:"icondingdanguanli",
      class:"top",
    },
    {
      title: '角色申请',
      key: '/system/role' ,
      icon:"iconjiaoseshenqing"
    },
    {
      title: '权限申请',
      key: '/system/personnel' ,
      icon:"iconquanxianshenqing"
    },
    {
      title: '设置',
      key: '/system/menuManage' ,
      icon:"iconshezhi",
    },
]

@inject('appStore') @observer
class SiderNav extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menusList:[], 
      keys:'',
    }
  }
  

  componentDidMount(){
    this.props.appStore.initMenus(menus)
    // this.tokenMenu()
  }
  tokenMenu = ()=>{
    axios.ajax({
      url:api.tokenMenu,
      method:"post",
      data:{}
    }).then((res)=>{
      this.setState({
        menusList:res.result
      })
      this.props.appStore.initMenus(res.result)
    }).catch(err =>{
      console.log(err)
    })
  }
  toutePush = ()=>{
    uitls.setCookies('pathname',"dashboard")
    const {from} = {from: {pathname: '/center/dashboard'}}
    this.props.history.push(from)
  }
  
  render() {
    return (
      <div>
        <div style={{padding: "14px 0 14px 24px",display:"flex",flexDirection:"row",alignItems:"center",background:"#7F63F4", cursor:"pointer"}} onClick = {this.toutePush}>
          <img src={require('../../assets/img/logo.png')} alt="logo" style={{width:"30px",height:"30px"}}/>
          {!this.props.collapsed ? <span style={{color:'#fff',fontSize:"15px",paddingLeft:"10px"}}>孕校云运营平台</span>
           : null}
        </div> 
        <CustomMenu menus={menus} collapsed={this.props.collapsed}/>
      </div>
    )
  }
}

export default SiderNav