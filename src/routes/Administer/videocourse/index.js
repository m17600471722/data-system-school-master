import React from 'react'
import moment from 'moment';
import {  Col, Row, Card,Input,Button, Avatar,Tooltip, Progress,Table,Layout  } from 'antd'
import styles from './style.less';
import BaseTable from '../../../components/baseTable'
import SeachForm from '../../../components/seachForm'
import Utils from '../../../assets/js/utils'
import axios from '../../../assets/js/axios'
import api from '../../../config/apiConfig'
import Crumbs from "../../../components/crumbs"
const { Meta } = Card;
const { Footer} = Layout
class Video extends React.Component {
  state = {
    loading:false,
    list:[],
    videoNum:{},
    text:{
      title:"昨日关键数据",
      sider:"视频课程"
    }
  }
  componentDidMount(){
    this.geTableList(Utils.FormatDateTime(this.formRef.getItemsValue()))
    this.getYesterdatData()
  }
  params = {
    page:1,
    pageSize:20
  }
  geTableList = (val = {})=>{
    this.setState({ loading: true });
    axios.ajax({
      url:api.dataDetailPage,
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
  getYesterdatData = ()=>{
    axios.ajax({
      url:api.yesterdayDataStats,
      method:"post",
      data:{}
    }).then((res)=>{
      this.setState({
        videoNum:res.result
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
        title: '课程ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '课程名称',
        dataIndex: 'courseName',
        key: 'courseName',
      },
      {
        title: '时间',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: '医院ID',
        dataIndex: 'hospitalId',
        key: 'hospitalId',
      },
      {
        title: '医院名称',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
      },
      {
        title: '学习人数',
        dataIndex: 'courseStudyCount',
        key: 'courseStudyCount',
      },
    ]
    return (
      <div className="School">
        <Crumbs text={this.state.text}></Crumbs>
        <div style={{margin: "30px 30px 0px"}}>
          <div className="top-info"> 
            <Row gutter={24}>
              <Col span={8}>
                <Card bordered={false}>
                  <Meta
                    className="PurpleCard FontSize"
                    style={{textAlign:"center"}}
                    title={this.state.videoNum.yesterdayVideoCourseIncrease}
                    description="昨日视频课程新增数"/>
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  <Meta
                    className="GreenCard FontSize"
                    style={{textAlign:"center"}}
                    title={this.state.videoNum.yesterdayVideoCourseViewCount}
                    description="昨日视频课程访问次数"/>
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  <Meta
                    className="PinkCard FontSize"
                    style={{textAlign:"center"}}
                    title={this.state.videoNum.yesterdayVideoCourseStudyCount}
                    description="昨日视频课程学习人数"/>
                </Card>
              </Col>
            </Row>
          </div>
            <Card className="tableList" bordered={false}>
              <SeachForm
                wrappedComponentRef={(form) => this.formRef = form}
                filterSubmit={this.handleFilter}
                downloadApi = {api.exportVideoCourseDetail}
                title="视频课程"/>  
                
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

export default Video