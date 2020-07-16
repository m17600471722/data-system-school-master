import React from 'react'
import moment from 'moment';
import {  Col, Row, Card, Avatar,Tooltip, Progress,Select,Table,Layout  } from 'antd'
import LineChart from "./lineChart"
import PieChart from "./pieChart"
import axios from '../../../assets/js/axios'
import api from '../../../config/apiConfig'
import {formatTime,recentlyData} from "../../../utils/utils"
import BaseTable from '../../../components/baseTable'
import Crumbs from "../../../components/crumbs"
const { Footer} = Layout
import './style.less'
const { Meta } = Card;
const { Option } = Select

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount:0,
      video:0,
      live:0,
      line:0,
      lineTime:formatTime(7),
      userInfo:{},
      hospitalInfo:{},
      selectVal:1,
      topList:[],
      option:{
        xAxis: {
          data: []
        },
        series: {pvList:[],uvList:[]}
      },
      text:{
        title:"基础数据",
        sider:"数据仪表盘"
      },
      data:[
        {value:1074, name:'历史访问记录'},
        {value:519, name:'公众号会话'},
        {value:3570, name:'公众号菜单'},
        {value:1800, name:'直接访问'},
        {value:2, name:'搜索引擎'},
        {value:1177, name:'分享'}
    ],
    }
  }
  componentDidMount(){
    this.getPageOther()
  }
  getPageOther = ()=>{
    // 小程序访问数(当日实时)
    axios.ajax({
      url:api.appVisitUserCount,
      method:"post",
    }).then((res)=>{
      this.setState({
        amount:res.result
      })
    }).catch(err =>{
      console.log(err)
    })
    // 面授课程签到数(当日实时)
    axios.ajax({
      url:api.courseStats,
      method:"post",
    }).then((res)=>{
      this.setState({
        video:res.result.todayVideoCourseStudyCount,
        live:res.result.todayLiveCourseViewCount,
        line:res.result.todayOfflineCourseSignInCount,
      })
    }).catch(err =>{
      console.log(err)
    })
    // 用户统计
    axios.ajax({
      url:api.userStats,
      method:"post",
    }).then((res)=>{
      this.setState({
        userInfo:res.result
      })
    }).catch(err =>{
      console.log(err)
    })
    // 医院统计
    axios.ajax({
      url:api.hospitalStats,
      method:"post",
    }).then((res)=>{
      this.setState({
        hospitalInfo:res.result
      })
    }).catch(err =>{
      console.log(err)
    })
    // 医院top
    axios.ajax({
      url:api.hospitalVisitTop5,
      method:"post",
    }).then((res)=>{
      res.result.map((item,i)=>{
        item.id = i+1
      })
      this.setState({
        topList:res.result
      })
    }).catch(err =>{
      console.log(err)
    })
  }
  // 去除字符串中的逗号
  clear = (str)=>{
    let NewVal =  str.toString().replace(/,/g, "");
    return NewVal
  }
  calculationP = (data)=>{
    let val = this.clear(data)
    let allNum = parseInt(this.clear(this.state.video)) + parseInt(this.clear(this.state.line)) + parseInt(this.clear(this.state.live))
    if(!allNum){
      return 0
    }
    // Math.round取整，防止出现0.57*100 = 56.99999999999999
    return Math.round((val/allNum).toFixed(2)*100)
  }
  progressBar = ()=>{
    let arr = [];
    arr.push({numP:this.calculationP(this.state.video),num:this.state.video,name:"视频课程学习数"});
    arr.push({numP:this.calculationP(this.state.line),num:this.state.line,name:"面授课程签到数"});
    arr.push({numP:this.calculationP(this.state.live),num:this.state.live,name:"直播课程进入数"});
    arr.sort(function(a, b){return a.num- b.num;});
    return (
      <div>
        <div className="schedule">
          <div className="Bar"> 
            <div style={{width: arr[0].numP+"%",background:"#7F63F4",zIndex:100}}></div> 
            <div style={{width: arr[1].numP+arr[0].numP+"%",background:"#FE60AD",zIndex:50}}></div> 
            <div style={{width: arr[2].numP ? "100%" : "0%",background:"#29C4B2",zIndex:10}}></div> 
          </div> 
        </div> 
        {this.progressNum(arr)}
      </div>
    )
  }
  progressNum = (arr)=>{
    return (
      <Row className="ProgressName">
        <Col>
          <div style={{color:"#7F63F4"}}>{arr[0].name}</div>
          <div className="signInNum" style={{color:"#7F63F4"}}>{arr[0].num}</div>
        </Col>
        <Col>
          <div style={{color:"#FE60AD"}}>{arr[1].name}</div>
          <div className="signInNum" style={{color:"#FE60AD"}}>{arr[1].num}</div>
        </Col>
        <Col>
          <div style={{color:"#29C4B2"}}>{arr[2].name}</div>
          <div className="signInNum" style={{color:"#29C4B2"}}>{arr[2].num}</div>
        </Col>
      </Row>
    )
  }
  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '医院名称',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
      },
      {
        title: '日期',
        dataIndex: 'yesterday',
        key: 'yesterday',
      },
      {
        title: '所有文章数',
        dataIndex: 'knowledgeBaseCount',
        key: 'knowledgeBaseCount',
      },
      {
        title: '课程数',
        dataIndex: 'allCourseCount',
        key: 'courallCourseCountse',
      },
      {
        title: '用户访问数',
        dataIndex: 'visitCount',
        key: 'visvisitCountvisitCountit',
      },
    ];

    return (
      <div className="Dashboard">
        <Crumbs text={this.state.text}></Crumbs>
        <div style={{margin: "30px 30px 0px"}}>
        <div className="top-info"> 
          <Row gutter={24}>
            <Col span={6}>
              <Card bordered={false}>
                <Meta
                  className="PurpleCard FontSize"
                  avatar={
                    <Avatar size={48} className="avatar" src={require('../../../assets/img/userNum.png')} />
                  }
                  style={{textAlign:"right",fontSize:"15px"}}
                  title={this.state.userInfo.todayUserIncrease}
                  description="日新增用户数"
                />
                <div className="text">注册用户总数 <span>{this.state.userInfo.userTotalCount}</span></div>
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>
                <Meta
                  className="GreenCard FontSize"
                  avatar={
                    <Avatar size={48} src={require('../../../assets/img/all.png')}/>
                  }
                  style={{textAlign:"right"}}
                  title={this.state.hospitalInfo.activeHospitalCount}
                  description="总计激活数"
                />
                <div className="text">医院总数 <span>{this.state.hospitalInfo.hospitalTotalCount}</span></div>
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <div className="Access"><span>日小程序访问数</span> <span style={{fontSize:"28px",fontWeight:"bold",marginLeft: "10px"}}>{this.state.amount}</span></div>
                {this.progressBar()}
              </Card>
            </Col>
          </Row>
        </div>
        <LineChart echartData = {this.state.option} selectVal={this.state.selectVal}/>
        <div className="Total">
          <div className="userTotal">
            <p>用户数据总量</p>
            <PieChart data={this.state.data}/>
          </div>
          <div className="TopHospital">
            <p className="topTitle">TOP医院</p>
            <Table 
              rowKey={record=>record.id}
              dataSource={this.state.topList}
              columns={columns}
              pagination={false}/>
          </div>
        </div>
        </div>
      </div>
    )
  }
}

export default Dashboard