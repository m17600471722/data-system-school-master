import React from 'react'
import moment from 'moment';
import {  Col, Row, Card,Input,Button,Modal, Avatar,Tooltip, Progress,Table,Layout  } from 'antd'
import styles from './style.less';
import BaseTable from '../../../components/baseTable'
import SeachForm from '../../../components/seachForm'
import YesterdayData from "../../../components/yesterdayData"
import axios from '../../../assets/js/axios'
import api from '../../../config/apiConfig'
import Utils from '../../../assets/js/utils'
import Crumbs from "../../../components/crumbs"
const { Footer} = Layout
const { Meta } = Card;
const pageSize = 20
class School extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading:false,
      list:[],
      visible: false,
      title:'',
      courseInfo:{},
      coverImg:[],
      imgs:[],
      text:{
        title:"昨日关键数据",
        sider:"孕校中台"
      }
    }
  }
  componentDidMount(){
    this.geTableList(Utils.FormatDateTime(this.formRef.getItemsValue()))
  }
  params = {
    page:1,
    pageSize:20
  }
  // 查询
  geTableList = (val = {})=>{
    this.setState({ loading: true });
    axios.ajax({
      url:api.hospitalDataStatsPage,
      method:"post",
      data:{
        currentPage:this.params.page,
        pageSize:this.params.pageSize,
        ...val
      }
    }).then((res)=>{
      res.currentPage = this.params.page
      res.pageSize = this.params.pageSize
      this.setState({
        list:res.result.rows,
        loading: false,
        pagination:Utils.pagination(res,(current,size)=>{
          this.params.page = current
          this.params.pageSize = size
          this.geTableList(val)
        })
      })
    }).catch(err =>{
      console.log(err)
    })
  }
  
  handleFilter =(params)=>{
    this.params.page = 1
    this.geTableList(Utils.FormatDateTime(params))
  }

  handleSubmit = ()=>{
    this.formModal.props.form.validateFields((err, values) => {
    })
    
  }
  handleCancel = ()=>{
    this.setState({
      visible:false
    })
  }

  render() {
    const columns = [
      {
        title: '日期',
        key: 'date',
        width:150,
        render:(record)=>{
          return `${moment.unix((record.date/1000)).format('YYYY-MM-DD')}`
        }
      },
      {
        title: '医院ID',
        dataIndex: 'hospitalId',
        key: 'hospitalId',
        width:200,
      },
      {
        title: '医院名称',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        width:250,
      },
      {
        title: '登陆中台次数',
        dataIndex: 'hospitalLoginCount',
        key: 'hospitalLoginCount',
      },
      {
        title: '直播课程新增数量',
        dataIndex: 'liveCourseAddCount',
        key: 'liveCourseAddCount',
      },
      {
        title: '视频课程新增数量',
        dataIndex: 'videoCourseAddCount',
        key: 'videoCourseAddCount',
      },
      {
        title: '面授课程新增数量',
        dataIndex: 'courseAddCount',
        key: 'courseAddCount',
      },
      {
        title: '推送消息数',
        dataIndex: 'pushMessageCount',
        key: 'pushMessageCount',
      },
      {
        title: '推送用户数',
        dataIndex: 'pushMessageUserCount',
        key: 'pushMessageUserCount',
      }
    ]
    return (
      <div className="School">
        <Crumbs text={this.state.text}></Crumbs>
        <div style={{margin: "30px 30px 0px"}}>
          <div className="top-info"> 
            <YesterdayData/>
          </div>
          <Card className="tableList" bordered={false}>
            <SeachForm
              wrappedComponentRef={(form) => this.formRef = form}
              filterSubmit={this.handleFilter}
              downloadApi = {api.exportHospitalData}
              title = "孕校中台医院数据统计"/>  
          </Card>
          <Card style={{marginTop:10}}>
            <BaseTable
              dataSource={this.state.list}
              columns={columns}
              rowSelection={null}
              pagination={this.state.pagination}
              loading={this.state.loading}
            />
          </Card> 
        </div>
      </div>
    )
  }
}

export default School