import React, { Component } from 'react'
import { Card,Modal, message } from 'antd'
import BaseTable from '../../../components/baseTable'
import BaseButton from '../../../components/baseButton'
import BaseForm from '../../../components/baseForm'
import Utils from '../../../assets/js/utils'
import axios from '../../../assets/js/axios'
import api from '../../../config/apiConfig'
import FormModal from './formModal'
import AccountModal from './accountModal'
const { confirm } = Modal;
const pageSize = 20

export default class UnderLine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title:'',
      hospitalList:[],
      loading:false,
      confirmLoading:false,
      isVisible:false,
      isAccount:false,
      accountList:[],
      accountInfo:{},
      itemInfo:{},
      formList:[
        {
          type:'SEARCHINPUT',
          label:'医院',
          field:'hospitalId',
          placeholder:'请输入搜索内容',
          width:250
        },
      ],
      buttonList:[
        {
          type:"primary",
          text:"创建",
          attribute:"establish"
        },
      ],
      list:[],
      groupsList:[]
    }
  }
  params = {
    page:1
  }
  componentDidMount(){
   
  }
  listAdminInfo = (val={})=>{
    // 账号列表
    this.setState({ loading: true })
    axios.ajax({
      url:api.adminInfo,
      method:"get",
      data:{
        params:{
          offsetPage:this.params.page,
          pageSize:pageSize,
          ...val
        }
      }
    }).then((res)=>{
      this.setState({
        accountList:res.result,
        loading: false,
        pagination:Utils.pagination(res,(current)=>{
          this.params.page = current
          this.listAdminInfo(val)
        })
      })
    }).catch(err =>{
    })
  }
  businessPass = (id)=>{
    // 重置密码
    axios.ajax({
      url:api.businessPass,
      method:"put",
      data:{
        adminid:id
      }
    }).then((res)=>{
      this.setState({
        accountInfo:JSON.parse(res.result),
        isAccount:true
      })
      message.success('密码重置成功')
    }).catch(err =>{
      console.log(err)
    })
  }
  adminGroupsList=(val = {})=>{
    // 角色列表
    axios.ajax({
      url:api.adminGroups,
      method:"get",
      data:{
        params:{}
      }
    }).then((res)=>{
      this.setState({
        groupsList:res.result
      })
    }).catch(err =>{
      console.log(err)
    })
  }
  adminInfoAdd=(val = {})=>{
    // 创建账号
    axios.ajax({
      url:api.adminInfo,
      method:"post",
      data:val
    }).then((res)=>{
      this.setState({
        accountInfo:JSON.parse(res.result),
        isVisible:false,
        isAccount:true,
        confirmLoading:false
      })
      message.success('帐号添加成功')
      this.params.page = 1
      this.listAdminInfo()
    }).catch(err =>{
      console.log(err)
    })
  }
  adminInfoEdit=(val = {})=>{
    // 修改账号
    axios.ajax({
      url:api.adminInfo,
      method:"put",
      data:val
    }).then((res)=>{
      this.setState({
        isVisible:false,
        confirmLoading:false
      })
      message.success('操作成功')
      this.listAdminInfo()
    }).catch(err =>{
      console.log(err)
    })
  }
  listHospital = ()=>{
    axios.ajax({
      url:api.hospitalListNoPage,
      method:"post",
      data:{}
    }).then((res)=>{
      let arr = []
      res.result.forEach(item =>{
        let obj = {
          id:item.id,
          name:item.name
        }
        arr.push(obj)
      })
      this.setState({
        hospitalList:arr,
      })
    }).catch(err =>{
      console.log(err)
    })
  }
  handleButton = (type)=>{
    this.setState({
      itemInfo:{},
      accountInfo:{},
      isVisible:true,
      title:'创建帐号'
    })
  }
  handleAuthSubmit = ()=>{

  }
  handleSubmit = ()=>{
    this.formModal.props.form.validateFields((err, values) => {
      if(!err){
        let vals = {
          ...values,
          groups:values.remarks ? JSON.stringify([values.remarks]) : [], 
          hospitalId:values.hospitalId === '-1' ? '' : values.hospitalId
        }
        delete vals.remarks
        this.setState({confirmLoading:true})
        if(this.state.itemInfo.id){
          vals.id = this.state.itemInfo.id
          this.adminInfoEdit(vals)
          return
        }
        this.adminInfoAdd(vals)
      }
    })
  }
  resetPassword = (id)=>{
    let that = this
    confirm({
      title: '提醒',
      content: '确认需要重置密码吗?',
      onOk() {
        that.businessPass(id)
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }
  handleFilter = (params)=>{
    this.params.page = 1
    this.listAdminInfo(params)
  }
  searchContents = (val)=>{
    if(!val){
      let formList = this.state.formList
      formList[0].list = []
      this.setState({
        formList
      })
      return
    }
    axios.ajax({
      url:api.hospitalListSearch,
      method:"post",
      data:{
        hospitalName:val
      }
    }).then((res)=>{
      if(res.result.length > 0){
        let arr = []
        res.result.forEach(item =>{
          let obj = {
            id:item.id,
            name:item.name
          }
          arr.push(obj)
        })
        let formList = this.state.formList
        formList[0].list = arr
        this.setState({
          formList
        })
      } else {
        let formList = this.state.formList
        formList[0].list = []
        this.setState({
          formList
        })
      }
    }).catch(err =>{
      console.log(err)
    })
  }
  render(){
    const { 
      confirmLoading,
      formList,
      buttonList,
      accountList,
      pagination,
      loading,
      title,
      isVisible,
      groupsList,
      itemInfo,
      hospitalList,
      isAccount,
      accountInfo
    } = this.state
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'aname',
        key: 'aname',
      },
      {
        title: '昵称',
        dataIndex: 'anickname',
        key: 'anickname',
      },
      {
        title: '医院',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        render: (record) => {
          return record ? record : "全部"
        }
      },
      {
        title: '角色名称',
        dataIndex: 'adminGroupLink',
        key: 'adminGroupLink',
        render: (record) => {
          return record.length >0 && record[0].name ? record[0].name  : '无'
        }
      },
      {
        title: '帐号类型',
        dataIndex: 'type',
        key: 'type',
        render(status){ 
          let config = {
            0:"超级管理员",
            1:"普通管理员",
            2:"运营管理员"
          }
          return config[status]
        }
      },
      {
        title: '状态',
        dataIndex: 'nousage',
        key: 'nousage',
        width:100,
        render(status){
          return status == '0' ? '启用' : '停用'
        }
      },
      {
        title: '操作',
        width:140,
        render: (record) => {
          return (
            <div>
              <a onClick={()=>{this.resetPassword(record.id)}}>重置密码</a>
              <span className='ant-divider'></span>
              <a onClick={()=>{
                this.setState({
                  isVisible:true,
                  title:'编辑帐号',
                  itemInfo:record
                })
              }}>编辑</a>
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