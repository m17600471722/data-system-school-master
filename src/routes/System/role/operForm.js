import React, { Component } from 'react'
import {Form,Input,Tree,Row, Col,Checkbox,Button,Select,InputNumber } from 'antd'
import Utils from '../../../assets/js/utils'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const { TreeNode } = Tree
const { Option } = Select
class OperForm extends Component {
  state={
    buttonName:"",
    record:{},
    plainOptions:[],
    haveButton:[],
    buttonList:[
      {
        name:"添加",
        type:"add"
      },
      {
        name:"修改",
        type:"eit"
      },
      {
        name:"设置",
        type:"set"
      },
      {
        name:"删除",
        type:"dele"
      }
    ]
  }
  reduceDimension =(arr)=> {
    return Array.prototype.concat.apply([], arr);
  }
  selectButtonType = (val) => {
    let haveButton = this.state.haveButton
    let arr = haveButton.find(item => {
      if(item.id === val){
        return item
      }
    })
    console.log(arr)
    this.props.form.setFieldsValue({
      name:arr.name,
      type:arr.type,
      sort:arr.sort
    })
  }
  getDetailById = (obj, id) => {
    for (let item of obj) {
      if (item.id == id) {
        return item
      }
      if (item.subs && item.subs.length > 0) {
        const temp = this.getDetailById(item.subs, id)
        if (temp) {
          return temp
        }
      }
    }
  }
  onSelect = (selectedKeys,e) => {
    const { roleMenuList } = this.props
    const temp = this.getDetailById(roleMenuList, selectedKeys[0])
    let plainOptions = this.renderButtonList(temp && temp.button)
    this.props.form && this.props.form.resetFields()
    this.setState({
      selectId:selectedKeys[0],
      record:temp,
      haveButton:temp && temp.button,
      plainOptions
    })
  }
  hanldeButton = (item)=>{
    this.setState({
      buttonName:item.name
    })
    this.props.form && this.props.form.resetFields()
  }
  renderButtonList = (data = []) => {
    let arr = []
    data.forEach(item =>{
      let obj = {
        label:item.name,
        value:item.id
      }
      arr.push(obj)
    })
    return arr
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if(this.state.buttonName === '删除' || this.state.buttonName === '添加'){
      const { roleMenuList } = nextProps
      const { selectId } = this.state
      const temp = this.getDetailById(roleMenuList, selectId)
      let plainOptions = this.renderButtonList(temp && temp.button)
      this.setState({
        haveButton:temp && temp.button,
        plainOptions
      })
    }
  }
  submission = () =>{
    this.props.hanldeButtons(this.state.buttonName,this.state.selectId)
  }
  initButton = ()=>{
    return (
      this.state.buttonList.map((item,index)=>{
        return <Button type='primary' ghost onClick={()=> this.hanldeButton(item)} key={index}>{item.name}</Button>
      })
    )
  }
  selectbutton = (data = []) =>{
    let arr = []
    data.forEach(item => {
      if(item.flag === 1){
        arr.push(item.id) 
      }
    })
    return arr
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
      labelCol: {span: 6},
      wrapperCol: {span: 16}
    }
    const roleInfo = this.props.roleInfo

    return (
      <Form layout="horizontal">
        <Row>
          <Col span={12}>
            <FormItem label="角色名称" {...formItemLayout}>
              {
                getFieldDecorator("roleName",{
                  initialValue: roleInfo.name,
                })(
                  <Input disabled />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Row style={{marginBottom:"20px"}}>
              <Col>
              <Button.Group>
                {
                  this.initButton()
                }
              </Button.Group>
              </Col>
            </Row>
            <Tree showLine={true} defaultExpandedKeys={['all']} onSelect={this.onSelect}>
              <TreeNode title="平台权限" key="all">
                {this.initTreeNodes(this.props.roleMenuList)}
              </TreeNode>
            </Tree>
          </Col>
          <Col span={12}>
          {this.state.buttonName == '修改' ? 
              
              <FormItem label="选择按钮" {...formItemLayout}>
                {
                  getFieldDecorator("id",{
                    rules:[
                      {
                        required:true,
                        message:'按钮不能为空'
                      }
                    ]
                  })(
                    <Select showSearch optionFilterProp="children" onChange={this.selectButtonType}>
                      {Utils.getOptionList(this.state.haveButton,true)}
                    </Select>
                  )
                }
              </FormItem>
            : null}
            {this.state.buttonName == '添加' || this.state.buttonName == '修改' ?
              <span>
                <FormItem label="节点ID" {...formItemLayout}>
                  {
                    getFieldDecorator("premId",{
                      initialValue: this.state.selectId,
                      rules:[
                        {
                            required:true,
                            message:'节点ID不能为空'
                        }
                      ]
                    })(
                      <Input disabled/>
                    )
                  }
                </FormItem>
                <FormItem label="按钮名称" {...formItemLayout}>
                  {
                    getFieldDecorator("name",{
                      rules:[
                        {
                          required:true,
                          message:'按钮名称不能为空'
                        }
                      ]
                    })(
                      <Input maxLength={10} />
                    )
                  }
                </FormItem>
                <FormItem label="按钮类型" {...formItemLayout}>
                  {
                    getFieldDecorator("type",{
                      rules:[
                        {
                          required:true,
                          message:'按钮类型不能为空'
                        }
                      ]
                    })(
                      <Select>
                        <Option value={1}>头部按钮</Option>
                        <Option value={2}>列表按钮</Option>
                      </Select>
                    )
                  }
                </FormItem>
                <FormItem label="排序" {...formItemLayout}>
                  {
                    getFieldDecorator('sort',{
                      initialValue:1,
                    })(
                      <InputNumber min={1} max={99} style={{ width: 200 }}/>
                    )
                  }
                </FormItem>
              </span>
            : null}
            {this.state.buttonName == '设置' || this.state.buttonName == '' ?
              <span>
                <FormItem label="节点ID" {...formItemLayout}>
                  {
                    getFieldDecorator("premId",{
                      initialValue: this.state.selectId,
                      rules:[
                        {
                            required:true,
                            message:'节点ID不能为空'
                        }
                      ]
                    })(
                      <Input disabled/>
                    )
                  }
                </FormItem>
                <FormItem label="当前权限" {...formItemLayout}>
                  {
                    getFieldDecorator("buttons",{
                      initialValue: this.selectbutton(this.state.haveButton),
                    })(
                      <Select mode="multiple">
                        {Utils.getOptionList(this.state.haveButton,true)}
                      </Select>
                    )
                  }
                </FormItem>
              </span>
            : null}
            {this.state.buttonName == '删除' ? 
              <FormItem>
                {
                  getFieldDecorator("id",{
                    rules: [
                      { type: 'array', 
                      required: true,
                       message: '请选择需要删除的按钮' },
                    ],
                  })(
                    <CheckboxGroup
                      options={this.state.plainOptions}
                      onChange={this.onChange}
                    />
                  )
                }
              </FormItem>
            : null}
            {this.state.buttonName ? 
              <Row>
                <Col>
                  <Button type="primary" onClick={this.submission}>{this.state.buttonName}</Button>
                </Col>
              </Row>
            : null}
            
          </Col>
        </Row>
      </Form>
    )
  }
}
export default OperForm = Form.create({})(OperForm)