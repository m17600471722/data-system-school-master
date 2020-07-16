import React, { Component } from 'react'
import { Form,Input,Select} from 'antd'
import Utils from '../../../assets/js/utils'
const FormItem = Form.Item
const { Option } = Select;

class FormModal extends Component{
  state = {
    isShow:false
  }
  componentDidMount(){
    this.setState({
      isShow:this.props.itemInfo && this.props.itemInfo.type === 0 ? false :this.props.itemInfo && this.props.itemInfo.type ? true : false
    })
  }
  onChangeHospital = (val)=>{
    if(val === '-1'){
      this.props.form.setFieldsValue({type:0})
      this.setState({
        isShow:false
      })
    } else {
      this.props.form.setFieldsValue({type:1})
      this.setState({
        isShow:true
      })
    }
  }
  onChangeType = (val)=>{
    if(val === 1) {
      this.props.form.setFieldsValue({hospitalId:''})
      this.setState({
        isShow:true
      })
    } else {
      this.props.form.setFieldsValue({hospitalId:'-1'})
      if(val == 0){
        this.setState({
          isShow:false
        })
      } else if (val == 2) {
        this.setState({
          isShow:true
        })
      }
      
    }
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const itemInfo = this.props.itemInfo
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
  };
    return (
      <Form layout="horizontal">
        <FormItem label="账号名称" {...formItemLayout}>
          {
            getFieldDecorator('aname',{
              initialValue:itemInfo.aname,
              rules:[
                {
                    required:true,
                    message:'账号名称不能为空'
                },
                {
                    min:2,max:12,
                    message:'字符长度不在范围内'
                }
              ]
          })(
                <Input type="text" placeholder="请输入账号名称" allowClear disabled={itemInfo.id ? true : false}/>
            )
          }
        </FormItem>
        <FormItem label="账号昵称" {...formItemLayout}>
          {
            getFieldDecorator('anickname',{
              initialValue:itemInfo.anickname,
              rules:[
                {
                    required:true,
                    message:'账号昵称不能为空'
                },
                {
                    min:2,max:12,
                    message:'字符长度不在范围内'
                }
              ]
          })(
                <Input type="text" placeholder="请输入账号昵称" allowClear/>
            )
          }
        </FormItem>
        <FormItem label="所属医院"  {...formItemLayout}>
          {
            getFieldDecorator('hospitalId',{
              initialValue:itemInfo.aname && !itemInfo.hospitalId ? '-1' : itemInfo.hospitalId,
              rules:[
                {
                  required:true,
                  message:'不能为空'
                }
              ]
            })(
              <Select showSearch optionFilterProp="children" disabled={itemInfo.id ? true : false} onChange={(val)=>{this.onChangeHospital(val)}}>
                {Utils.getOptionList(this.props.hospitalList,false)}
              </Select>
            )
          }
        </FormItem>
        <FormItem label="账号状态" {...formItemLayout}>
          {
            getFieldDecorator('nousage',{
              initialValue:itemInfo.nousage || 0,
              rules:[
                {
                  required:true,
                  message:'账号状态不能为空'
                }
              ]
            })(
              <Select>
                <Option value={0}>启用</Option>
                <Option value={1}>停用</Option>
              </Select>
          )}
        </FormItem>
        <FormItem label="账号类型" {...formItemLayout}>
          {
              getFieldDecorator('type',{
                  initialValue:itemInfo.id ? itemInfo.type : 0,
                  rules:[
                    {
                        required:true,
                        message:'账号类型不能为空'
                    }
                  ]
              })(
                <Select onChange={(val)=>{this.onChangeType(val)}}>
                  <Option value={1}>普通管理员</Option>
                  <Option value={0}>超级管理员</Option>
                  <Option value={2}>运营管理员</Option>
                </Select>
          )}
        </FormItem>
        {this.state.isShow ? 
          <FormItem label="账号角色" {...formItemLayout}>
            {
              getFieldDecorator('remarks',{
                  initialValue:itemInfo.adminGroupLink && itemInfo.adminGroupLink.length >0 ?  itemInfo.adminGroupLink[0].groupid : "",
                  rules:[
                    {
                      required:true,
                      message:'账号角色不能为空'
                    }
                  ]
              })(
                <Select showSearch optionFilterProp="children">
                  {Utils.getOptionList(this.props.groupsList,true)}
                </Select>
            )}
          </FormItem>
         : null}
      </Form>
    )
  }
}

export default Form.create({})(FormModal)