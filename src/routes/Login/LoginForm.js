import React from 'react'
import { randomNum } from '../../utils/utils'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Form, Input, Row, Col,Icon,Button,Checkbox } from 'antd'
import md5 from 'js-md5'
import axios from '../../assets/js/axios'
import api from '../../config/apiConfig'
import uitls from '../../assets/js/utils'

@withRouter @inject('appStore') @observer @Form.create() 
class LoginForm extends React.Component {
  state = {
    code: ''         //验证码
  }

  componentDidMount () {
    this.createCode()
  }
  onChangeCheckbox = (e)=>{
    let val = e.target.checked
    if(!val){
      this.props.form.setFields({
        agreement: {
          value: val.agreement,
          errors: [new Error('请勾选协议')]
        }
      })
    } else {
      this.props.form.setFields({
        agreement: {
          value: val.agreement,
          errors: []
        }
      })
    }
  }
  /**
   * 生成验证码
   */
  createCode = () => {
    const ctx = this.canvas.getContext('2d')
    const chars = [ 2, 3, 4, 5, 6, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let code = ''
    ctx.clearRect(0, 0, 120, 49)
    for (let i = 0; i < 4; i++) {
      const char = chars[randomNum(0, 53)]
      code += char
      ctx.font = randomNum(30,35) + 'px SimHei'  //设置字体随机大小
      ctx.fillStyle = '#8a95f2'
      ctx.textBaseline = 'middle'
      ctx.shadowOffsetX = randomNum(-3, 3)
      ctx.shadowOffsetY = randomNum(-3, 3)
      ctx.shadowBlur = randomNum(-3, 3)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      let x = 120 / 5 * (i + 1)
      let y = 49 / 2
      let deg = randomNum(-25, 25)
      /**设置旋转角度和坐标原点**/
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(char, 0, 0)
      /**恢复旋转角度和坐标原点**/
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    }
    this.setState({
      code
    })
  }
  loginSubmit = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.code.toUpperCase() !== values.verification.toUpperCase()) {
          this.props.form.setFields({
            verification: {
              value: values.verification,
              errors: [new Error('验证码错误')]
            }
          })
          return
        }
        if(!values.agreement){
          this.props.form.setFields({
            agreement: {
              value: values.agreement,
              errors: [new Error('请勾选协议')]
            }
          })
          return
        }
        let vals = {
          username:values.aname,
          password:md5(values.password)
        }
        this.adminLogin(vals)
      }
    })
  }
  handleEnterKey = (e)=>{
    if(e.nativeEvent.keyCode === 13){
      this.loginSubmit()
    }
  }
  adminLogin =(val)=>{
    axios.ajax({
      url:api.adminLogin,
      method:"post",
      data:val
    }).then((res)=>{
      this.props.appStore.toggleLogin(true, {result: res.result})
      // const {from} = this.props.location.state || {from: {pathname: '/center/dashboard'}}
      uitls.setCookies('pathname',"dashboard")
      const {from} = {from: {pathname: '/center/dashboard'}}
      this.props.history.push(from)
    }).catch(err =>{
      this.createCode()
    })
  }
  render () {
    const {getFieldDecorator} = this.props.form
    const { code} = this.state
    return (
      <div className={this.props.className}>
          <Form.Item>
            {getFieldDecorator('aname', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(
              <Input
                style={{ width: 400 }}
                placeholder='请输入用户名'
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input
                type="password"
                style={{ width: 400 }}
                placeholder='请输入密码'
              />
            )}
          </Form.Item>
          <Row>
            <Col span={15}>
              <Form.Item>
                {getFieldDecorator('verification', {
                  rules: [
                    { required: true, message: '请输入验证码!' },
                    {
                      validator: (rule, value, callback) => {
                        if (value && value.length != 4 && code.toUpperCase() !== value.toUpperCase()) {
                          callback('验证码错误')
                        }
                        callback()
                      }
                    }
                  ]
                })(
                  <Input
                    placeholder="请输入验证码"
                    maxLength={4}
                    onKeyUp={this.handleEnterKey}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={9} style={{padding:"5px 10px 0 0",textAlign:"right"}}>
              <canvas onClick={this.createCode} width="120" height='49' ref={el => this.canvas = el}/>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item >
                {
                  getFieldDecorator('agreement', {
                      valuePropName: 'checked',
                      initialValue: true,
                  })(
                    <Checkbox onChange={this.onChangeCheckbox}>
                      {<span>同意<a style={{color:"#82D2D0"}} href="https://mj.yunxiaoos.com/agreement.html" target="_blank">《共享协议》</a></span>}
                    </Checkbox>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
            <Button type="primary" style={{}} htmlType="submit" className="login-form-button" onClick={this.loginSubmit}>
              登录
            </Button>
      </div>
    )
  }
}

export default LoginForm