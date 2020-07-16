import React, { Component } from 'react'
import { Card,Modal, message,Button } from 'antd'
import BaseTable from '../../../components/baseTable'
import BaseButton from '../../../components/baseButton'
import axios from '../../../assets/js/axios'
import api from '../../../config/apiConfig'
import FormModal from './formModal'
import AuthForm from './authForm'
import OperForm from './operForm'

export default class UnderLine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title:'',
      loading:false,
      isVisible:false,
      isAuthVisible:false,
      isOperation:false,
      roleInfo:{},
      menuInfo:[],
      halfcheck:[],
      menuDataList:[],
      roleMenuList:[],
      buttonList:[
        {
          type:"primary",
          text:"创建",
          attribute:"establish"
        },
      ],
      list:[]
    }
  }
  params = {
    page:1
  }
  componentDidMount(){
  
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
  groupPremButtonUpdate=(val = {})=>{
    axios.ajax({
      url:api.groupPremButtonUpdate,
      method:"put",
      data:{
        ...val
      }
    }).then((res)=>{
      message.success('操作成功')
      this.getMenuForGroupId(this.state.roleInfo.id)
    }).catch(err =>{
      console.log(err)
    })
  }
  getMenuForGroupId=(id)=>{
    this.setState({loading:true})
    axios.ajax({
      url:api.getMenuForGroupId,
      method:"post",
      data:{
        groupId:id
      }
    }).then((res)=>{
      this.setState({
        roleMenuList:res.result,
        isOperation:true,
        loading:false
      })
    }).catch(err =>{
      console.log(err)
    })
  }
  adminGroupsList=(val = {})=>{
    // 列表
    axios.ajax({
      url:api.adminGroups,
      method:"get",
      data:{
        params:{}
      }
    }).then((res)=>{
      this.setState({
        list:res.result
      })
    }).catch(err =>{
      console.log(err)
    })
  }
  adminGroupsEdit=(val = {})=>{
    // 修改角色
    axios.ajax({
      url:api.adminGroups,
      method:"put",
      data:val
    }).then((res)=>{
      this.setState({
        isVisible:false,
        confirmLoading:false
      })
      this.adminGroupsList()
    }).catch(err =>{
      console.log(err)
    })
  }
  adminGroupsAdd=(val = {})=>{
    // 创建角色
    axios.ajax({
      url:api.adminGroups,
      method:"post",
      data:{
        type:"0",
        ...val
      }
    }).then((res)=>{
      this.setState({
        isVisible:false,
        confirmLoading:false
      })
      this.adminGroupsList()
    }).catch(err =>{
      console.log(err)
    })
  }
  adminGroupPerms=(val = {})=>{
    // 设置权限
    axios.ajax({
      url:api.adminGroupPerms,
      method:"post",
      data:val
    }).then((res)=>{
      this.setState({
        isAuthVisible:false,
        confirmLoading:false
      })
      this.adminGroupsList()
      message.success('设置成功')
    }).catch(err =>{
      console.log(err)
    })
  }
  handleButton = (type)=>{
    this.setState({
      menuInfo:[],
      roleInfo:[],
      isVisible:true,
      title:'创建角色'
    })
  }
  handleSubmitRole = ()=>{
    this.formModal.props.form.validateFields((err, values) => {
      if(!err){
        this.setState({confirmLoading:true})
        if(this.state.roleInfo.id){
          values.id = this.state.roleInfo.id
          this.adminGroupsEdit(values)
          return
        }
        this.adminGroupsAdd(values)
      }
    })
  }
  handleOperSubmit  = (type,id)=>{
    this.operForm.props.form.validateFields((err, values) => {
      if(!err){
        delete values.roleName
        if(type === '设置'){
          let obj = {
            groupId:this.state.roleInfo.id,
            premId:id,
            buttons:JSON.stringify(values.buttons)
          }
          this.groupPremButtonUpdate(obj)
        }
        if(type === '删除'){
          this.deletePremButton(JSON.stringify(values.id))
        }
        if(type === '添加'){
          this.premButtonAdd(values)
        }
        if(type === '修改'){
          this.premButtonUpdate(values)
        }
      }
    })
  }
  premButtonUpdate = (val)=>{
    axios.ajax({
      url:api.premButtonUpdate,
      method:"put",
      data:{
        ...val
      }
    }).then((res)=>{
      message.success('修改成功')
      this.getMenuForGroupId(this.state.roleInfo.id)
      this.operForm.props.form.resetFields()
    }).catch(err =>{
      console.log(err)
    })
  }
  deletePremButton = (id)=>{
    axios.ajax({
      url:api.deletePremButton,
      method:"post",
      data:{
        id
      }
    }).then((res)=>{
      message.success('删除成功')
      this.getMenuForGroupId(this.state.roleInfo.id)
    }).catch(err =>{
      console.log(err)
    })
  }
  premButtonAdd = (val)=>{
    axios.ajax({
      url:api.premButtonAdd,
      method:"post",
      data:{
        ...val
      }
    }).then((res)=>{
      message.success('添加成功')
      this.getMenuForGroupId(this.state.roleInfo.id)
      this.operForm.props.form.resetFields()
    }).catch(err =>{
      console.log(err)
    })
  }
  handleAuthSubmit = ()=>{
    let obj ={
      groupid:this.state.roleInfo.id,
      permids:JSON.stringify(this.state.menuInfo),
      parentid:JSON.stringify(this.state.halfcheck),
    }
    this.setState({confirmLoading:true})
    this.adminGroupPerms(obj)
  }
  render(){
    const { 
      confirmLoading,
      list,
      buttonList,
      pagination,
      loading,
      title,
      isVisible,
      roleInfo,
      isAuthVisible,
      authorInfo,
      menuInfo,
      menuDataList,
      isOperation,
      roleMenuList 
    } = this.state
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        width:300,
        render: (record) => {
          return (
            <div>
              <Button type="link" onClick={()=>{
                this.setState({
                  isAuthVisible:true,
                  roleInfo:record,
                  menuInfo:record.perms.map(String),
                  halfcheck:record.parentid
                })
              }}>菜单权限</Button>
              <span className='ant-divider'></span>
              <Button type="link" onClick={()=>{
                this.getMenuForGroupId(record.id)
                this.setState({
                  roleInfo:record, 
                })
              }}>操作权限</Button>
              <span className='ant-divider'></span>
              <Button type="link" onClick={()=>{
                this.setState({
                  isVisible:true,
                  roleInfo:record,
                  title:'编辑角色',
                })
              }}>编辑</Button>
            </div>
          )
        },
      }
    ]
    return (
      <div style={{textAlign:"center"}}>
        <img className="development" src={require("../../../assets/img/development.png")}/>
        <p className="deveText">工程师正在加急开发中…</p>
      </div>
    )
  }
}