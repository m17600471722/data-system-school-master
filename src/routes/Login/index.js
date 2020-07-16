import React from 'react'
import { notification,Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import LoginForm from './LoginForm'
import './style.css'

@withRouter @inject('appStore') @observer
class Login extends React.Component {
  state = {
  }

  componentDidMount () {
    const isLogin = this.props.appStore
    if(isLogin){
      this.props.history.go(1)     //当浏览器用后退按钮回到登录页时，判断登录页是否登录，是登录就重定向上个页面
      // this.props.appStore.toggleLogin(false) //也可以设置退出登录
    }
  }

  componentWillUnmount () {
    this.particle && this.particle.destory()
    notification.destroy()
  }
  render () {
    return (
      <div id='login-page'>
        <div>
          <div id='backgroundBox'/>
          <div className="Title">
            <p>欢迎来到孕校云运营平台 </p>
            <img src={require("../../assets/img/Diagram.png")}/>
          </div>
          <LoginForm
              className={'box showBox'}/>
          {/* <Button type="danger" className="right-btn" icon="video-camera"  size="large" onClick={()=>{window.open("https://mj.yunxiaoos.com/video.html")}}>课程录制</Button> */}
        </div>
        <p className="footText"></p>
      </div>
    )
  }
}


export default Login
