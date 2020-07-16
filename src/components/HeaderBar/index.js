import React from 'react'
import { Icon, Dropdown, Menu, Avatar,Modal,Form,Input, message, BackTop } from 'antd'
const { Search } = Input;
import screenfull from 'screenfull'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import uitls from '../../assets/js/utils'
import axios from '../../assets/js/axios'
import api from '../../config/apiConfig'
import md5 from 'js-md5'
import './index.less'
const { confirm } = Modal
//withRouter一定要写在前面，不然路由变化不会反映到props中去
@withRouter @inject('appStore') @observer
class HeaderBar extends React.Component {
  state = {
    icon: 'fullscreen',
    isVisible:false
  }

  componentDidMount () {
    console.log("00",uitls.getCookies('userinfo'))
    screenfull.onchange(() => {
      this.setState({
        icon: screenfull.isFullscreen ? 'fullscreen-exit' : 'fullscreen'
      })
    })
  }

  componentWillUnmount () {
    screenfull.off('change')
  }

  toggle = () => {
    this.props.onToggle()
  }
  screenfullToggle = () => {
    screenfull.toggle()
  }
  logout = () => {
    let that = this
    confirm({
      title: '提醒',
      content: '确认需要退出吗？',
      onOk() {
        that.props.appStore.toggleLogin(false)
        that.props.appStore.buttonAuthority([])
        that.props.history.push(that.props.location.pathname)
      },
      onCancel() {
        console.log('Cancel')
      },
    });
  }
  changePassword=()=>{
    this.setState({
      isVisible:true
    })
  }
  handleSubmit = (e)=>{
    this.passwordForm.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let val ={
          oldPassword:md5(fieldsValue.oldpassword),
          newPassword:md5(fieldsValue.newpassword)
        }
        this.adminUpdatePass(val)
      }
      
    })
  }
  adminUpdatePass = (val={})=>{
    axios.ajax({
      url:api.adminUpdatePass,
      method:"post",
      data:val
    }).then((res)=>{
      this.setState({
        isVisible:false
      })
      message.success('密码修改成功,请重新登录！')
      uitls.removeCookies('sessionId')
      setTimeout(()=>{
        this.props.history.push('/login')
      },1000)
    }).catch(err =>{
      console.log(err)
    })
  }
  render () {
    const {icon} = this.state
    const {appStore, collapsed, location} = this.props
    const notLogin = (
      <div>
        <Link to={{pathname: '/login', state: {from: location}}} style={{color: 'rgba(0, 0, 0, 0.65)'}}>登录</Link>&nbsp;
        <img src={require('../../assets/img/defaultUser.jpg')} alt=""/>
      </div>
    )
    const menu = (
      <Menu>
        <Menu.Item onClick={this.changePassword}>
          <Icon type="edit" />
          修改密码
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={this.logout}>
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    )
    const login = (
      <Dropdown overlay={menu} placement="bottomCenter">
        <span className="action">
          <Avatar  className="avatar" src={require("../../assets/img/Image.png")} />
          <span className="name">{uitls.getCookies('userinfo') ? JSON.parse(uitls.getCookies('userinfo')).nickname : null}</span>
          <Icon type="caret-down" />
        </span>
      </Dropdown>
        // <div>
        //   <img src={require("../../assets/img/Image.png")} style={{marginRight:"15px"}}/>
        //   <span className="name">{uitls.getCookies('userinfo') ? JSON.parse(uitls.getCookies('userinfo')).nickName : null}</span>
        // </div>
    )
    return (
      <div id='headerbar'>
        {/* <Icon
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          className='trigger'
          onClick={this.toggle}/> */}
          <Search
            placeholder="Search..."
            onSearch={value => console.log(value)}
            style={{ width: 250,background:"#F3F3F3" }}
          />
        <div style={{lineHeight: '64px', float: 'right'}}>
          <ul className='header-ul'>
            {/* <li><Icon type={icon} onClick={this.screenfullToggle}/></li> */}
            <li><i className="iconfont icontongzhi-11" style={{color:"#AAAAAA",fontSize:"21px"}}></i></li>
            <li>
              {appStore.isLogin ? login : notLogin}
            </li>
          </ul>
        </div>
        <Modal
          title={'修改密码'} 
          visible={this.state.isVisible} 
          onOk={this.handleSubmit}
          onCancel={()=>{ this.passwordForm.props.form.resetFields(); this.setState({isVisible:false}) }} 
          width={600}>
          <PasswordForm wrappedComponentRef={(inst) => this.passwordForm = inst } />
        </Modal>
      </div>
    )
  }
}

class PasswordForm extends React.Component {
  state = {
    confirmDirty: false,
  };
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  validateToNextOldPassword=(rule, value, callback) => {
      const { form } = this.props;
      if(value && value.length <6){
          callback('密码长度6到12位');
      } else if((form.getFieldValue('newpassword') && (value === form.getFieldValue('newpassword'))) || (form.getFieldValue('confirm') && (value === form.getFieldValue('confirm'))) ){
          callback('新旧密码不能一致')
      }else {
          callback()
      }
  }
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if(value && value.length <6){
      callback('密码长度6到12位');
    }else if ((form.getFieldValue('newpassword') && form.getFieldValue('newpassword').length >5) && (value !== form.getFieldValue('newpassword')) ) {
      callback('您输入的密码与确认密码不一致')
    } else {
      callback()
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if(value && value.length <6){
      callback('密码长度6到12位');
    }else if ((form.getFieldValue('confirm') && form.getFieldValue('confirm').length > 5) && (value !== form.getFieldValue('confirm')) ) {
      callback('您输入的密码与确认密码不一致');
    }else if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };


  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Form layout="horizontal" {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="旧密码">
          {getFieldDecorator('oldpassword', {
            validateTrigger: ['onBlur'],
            rules:[
              {
                  required:true,
                  message:'旧密码不能为空'
              },
              {
                  pattern:new RegExp('^\\w+$','g'),
                  message:'必须为字母或者数字'
              },
              {
                  validator: this.validateToNextOldPassword,
              },
            ]
          })(<Input.Password maxLength={12}/>)}
        </Form.Item>
        <Form.Item label="新密码">
          {getFieldDecorator('newpassword', {
            validateTrigger: ['onBlur'],
            rules: [
              {
                required: true,
                message: '请输入新密码',
              },
              {
                  pattern:new RegExp('^\\w+$','g'),
                  message:'必须为字母或者数字'
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password maxLength={12}/>)}
        </Form.Item>
        <Form.Item label="确认新密码">
          {getFieldDecorator('confirm', {
            validateTrigger: ['onBlur'],
            rules: [
              {
                required: true,
                message: '请输入确认密码',
              },
              {
                  pattern:new RegExp('^\\w+$','g'),
                  message:'必须为字母或者数字'
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} maxLength={12}/>)}
        </Form.Item>
      </Form>
    );
  }
}
PasswordForm = Form.create({})(PasswordForm);

export default HeaderBar