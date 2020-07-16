import React, { Component } from 'react'
import {Form,Input,Select,Tree } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const { TreeNode } = Tree
class AuthForm extends Component {
  state={
  }
  reduceDimension =(arr)=> {
    return Array.prototype.concat.apply([], arr);
}
  onCheck = (checkedKeys,info) => {
    let checkedkey =[...checkedKeys].filter(item =>{
      return item !=='all'
    })
    let halfcheck = info.halfCheckedKeys.filter(item =>{
      return item !=='all'
    })
    this.props.patchMenuInfo(checkedkey,halfcheck)
  }
  initTreeNodes = (data) =>{
    return data.map(item => {
      if (item.subs && item.subs.length > 0){
        return (
          <TreeNode title={item.title} key={item.id}>
            {this.initTreeNodes(item.subs)}
          </TreeNode>
        )
      } else {
        return <TreeNode title={item.title} key={item.id} />
      }
    })
  }
  render (){
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    const roleInfo = this.props.roleInfo
    const menuInfo = this.props.menuInfo
    return (
      <Form layout="horizontal">
        <FormItem label="角色名称" {...formItemLayout}>
          {
            getFieldDecorator("roleName",{
              initialValue: roleInfo.name,
            })(
              <Input disabled/>
            )
          }
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
            {
                getFieldDecorator('status',{
                  initialValue: 1
                })(
                <Select style={{ width: 150 }} disabled>
                    <Option value={1}>启用</Option>
                    <Option value={0}>停用</Option>
                </Select>
            )}
        </FormItem>
        <Tree checkable defaultExpandAll onCheck={this.onCheck} checkedKeys={menuInfo}>
          <TreeNode title="平台权限" key="all">
            {this.initTreeNodes(this.props.menuDataList)}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}
export default AuthForm = Form.create({})(AuthForm)