import React, { Component } from 'react'
import {Form,Input,Tree,Row, Col,Button,Card,InputNumber,message,Radio } from 'antd'
import axios from '../../../assets/js/axios'
import api from '../../../config/apiConfig'
const FormItem = Form.Item
const { TreeNode } = Tree
class Menu extends React.Component {
  state={
    buttonName:"",
    menuDataList:[],
    record:{},
    selectId:null,
    buttonList:[
      {
        name:"添加",
        type:"add",
        button:'新增'
      },
      {
        name:"编辑",
        type:"set",
        button:'保存'
      },
      {
        name:"删除",
        type:"dele",
        button:'删除'
      }
    ]
  }
  componentDidMount(){

  }
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return
    }
  }
  getPageList =()=>{ 
    axios.ajax({
      url:api.tokenMenu,
      method:"post",
      data:{}
    }).then((res)=>{
      this.setState({
        menuDataList:res.result
      })
    }).catch(err =>{
      console.log(err)
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
    const { menuDataList } = this.state
    const temp = this.getDetailById(menuDataList, selectedKeys[0])
    if(selectedKeys[0] !== '0' && temp){
      this.props.form.setFieldsValue({
        premName:temp.title || '',
        parentid:selectedKeys[0],
        twoMenuKey:temp.key,
        sort:temp.sort || 1,
        firstMenuKey:temp.icon || ''
      })
    }
    this.setState({
      selectId:selectedKeys[0],
      record:temp,
      buttonName:"",
    })
  }
  hanldeButton = (item)=>{
    this.setState({
      buttonName:item.button
    })
    if(item.name === '添加') {
      this.setState({
        record:{}
      })
      this.props.form && this.props.form.resetFields()
    }
  }
  submission = ()=>{
    let type = this.state.buttonName
    this.props.form.validateFields((err, values) => {
      if(!err){
        if(type === '新增'){
          this.premAdd(values)
        }
        if(type === '保存'){
          let obj = {
            ...values,
            id:values.parentid
          }
          delete obj.parentid
          this.premUpdate(obj)
        }
        if(type === '删除'){
          if(values.parentid === '0'){
            message.error('无法删除此菜单')
            return 
          }
          this.deletePrem(values.parentid)
        }
      }
      
    })
  }
  deletePrem = (id)=>{
    axios.ajax({
      url:api.deletePrem,
      method:"delete",
      data:{
        params:{
          id
        }
      }
    }).then((res)=>{
      message.success('删除成功')
      this.props.form.resetFields()
      this.setState({
        record:{},
        selectId:null
      })
      this.getPageList()
    }).catch(err =>{
      console.log(err)
    })
  }
  premAdd = (val)=>{
    axios.ajax({
      url:api.premAdd,
      method:"post",
      data:{
        ...val
      }
    }).then((res)=>{
      message.success('添加成功')
      this.getPageList()
      this.setState({
        record:{},
      })
      this.props.form.resetFields()
    }).catch(err =>{
      console.log(err)
    })
  }
  premUpdate = (val)=>{
    axios.ajax({
      url:api.premUpdate,
      method:"put",
      data:{
        ...val
      }
    }).then((res)=>{
      message.success('保存成功')
      this.getPageList()
      this.setState({
        record:{},
      })
      this.props.form.resetFields()
    }).catch(err =>{
      console.log(err)
    })
  }
  initButton = ()=>{
    return (
      this.state.buttonList.map((item,index)=>{
        return <Button type='primary' ghost onClick={()=> this.hanldeButton(item)} key={index}>{item.name}</Button>
      })
    )
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
    return (
      <div style={{textAlign:"center"}}>
        <img className="development" src={require("../../../assets/img/development.png")}/>
        <p className="deveText">工程师正在加急开发中…</p>
      </div>
    )
  }
}
export default Menu 