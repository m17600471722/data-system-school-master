import React from 'react'
import moment from 'moment';
import {  Col, Row, Card,Input,Button, Avatar,Tooltip, Progress,Table,Layout  } from 'antd'
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
      text:{
        title:"昨日关键数据",
        sider:"医院管理"
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
  geTableList = (val = {})=>{
    this.setState({ loading: true });
    axios.ajax({
      url:api.hospitalDetailPage,
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
  render() {
    const columns = [
      {
        title: '医院ID',
        dataIndex: 'id',
        key: 'id',
        width:200,
      },
      {
        title: '医院名称',
        dataIndex: 'name',
        key: 'name',
        width:250,
      },
      {
        title: '注册时间',
        key: 'createDate',
        width:150,
        render:(record)=>{
          return `${moment.unix((record.createDate/1000)).format('YYYY-MM-DD')}`
        }
      },
      {
        title: '医院等级',
        dataIndex: 'grade',
        key: 'grade',
      },
      {
        title: '所属地区',
        key: 'videoCourseAddCount',
        render:(record)=>{
          return `${record.province+record.city}`
        }
      },
      {
        title: '讲师数量',
        dataIndex: 'expertNumber',
        key: 'expertNumber',
      },
      {
        title: '对应销售',
        dataIndex: 'salesman',
        key: 'salesman',
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
              downloadApi = {api.exportHospitalDetail}
              title="医院详情"/>  
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