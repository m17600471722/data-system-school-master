import React, { Component } from 'react'
import { Form,Input} from 'antd'
const FormItem = Form.Item

class FormModal extends Component{
  state = {
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const roleInfo = this.props.roleInfo
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
  };
    return (
      <Form layout="horizontal">
        <FormItem label="角色名称" {...formItemLayout}>
          {
            getFieldDecorator('name',{
              initialValue:roleInfo.name,
              rules:[
                {
                    required:true,
                    message:'角色名称不能为空'
                },
                {
                    min:2,max:12,
                    message:'字符长度不在范围内'
                }
              ]
          })(
                <Input type="text" placeholder="请输入角色名称" allowClear maxLength={12}/>
            )
          }
        </FormItem>
        <FormItem label="角色描述" {...formItemLayout}>
          {
              getFieldDecorator('remark',{
                  initialValue:roleInfo.remark,
                  rules:[
                    {
                        required:true,
                        message:'角色描述不能为空'
                    }
                  ]
              })(
              <Input.TextArea rows={3} placeholder="请输入说明" maxLength={100}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create({})(FormModal)