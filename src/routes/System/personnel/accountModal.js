import React, { Component } from 'react'
import { Form,Button,message} from 'antd'
import Utils from '../../../assets/js/utils'
const FormItem = Form.Item
 
class AccountModal extends Component{
  render () {
    const accountInfo = this.props.accountInfo
    const psw = Utils.decrypt(accountInfo.pwd,'khAIM0ojtmWe68UD')
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    };
    return (
      <Form layout="horizontal">
        <FormItem label="访问地址" {...formItemLayout}>
          {
            `${window.location.origin}/#/login`
          }
        </FormItem>
        <FormItem label="用户名" {...formItemLayout}>
          {accountInfo.aname}
        </FormItem>
        <FormItem label="密码" {...formItemLayout}>
          {psw}
        </FormItem>
        <div style={{marginBottom:'20px',color:'red'}}>注意！该密码为随机生成，仅显示一次，请复制发送给相应成员</div>
        {/* <CopyToClipboard
          text={`访问地址：${window.location.origin}/#/login \n用户名：${accountInfo.aname}\n密码：${psw}`} // 需要复制的文本
          onCopy={()=>{
            message.success('复制成功')
          }} // 复制完成的回调
        >
            <Button type="primary">复制</Button>
        </CopyToClipboard> */}
      </Form>
    )
  }
}

export default Form.create({})(AccountModal)