import React from 'react'
import Echarts from 'echarts';
import {formatTime,recentlyData} from "../../../utils/utils"
import axios from '../../../assets/js/axios'
import api from '../../../config/apiConfig'
import { Select } from 'antd'
const { Option } = Select

class LineChart extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          lineTime:formatTime(7),
          pvList:[],
          uvList:[],
          data:[],
        }
    }
    componentDidMount(){
      this.getDataList(this.state.lineTime)
    }
    getDataList = (data)=>{
      // 小程序访问趋势图数据
      axios.ajax({
        url:api.appVisitCurve,
        method:"post",
        data:data
      }).then((res)=>{ 
        this.setState({
          pvList:res.result.pvList,
          uvList:res.result.uvList,
          data:res.result.dateList
        })  
        this.loadEchart()
      }).catch(err =>{
        console.log(err)
      })
    }
    handleChange = (value)=>{
      let selectDay = formatTime(value)
      this.getDataList(selectDay) 
    }
    loadEchart =()=> {
        this.state.myChart = Echarts.init(document.getElementById("line"));
        this.state.myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          grid: {
              x: '0', //相当于距离左边效果:padding-left
              containLabel: true
          },

          xAxis: {
            type: 'category',
            data: this.state.data,
            axisLabel: {interval:0,rotate:40 },
            
          },
          yAxis: {
            type: 'value',
            
          },
          series: [
            {
              data: this.state.uvList,
              type: 'bar',
              smooth: true ,
              itemStyle:{ normal:{ color:'#7F63F4' } }                     
            },{
              data: this.state.pvList,
                type: 'bar',
                smooth: true,
                itemStyle:{ normal:{ color:'#29C4B2' } } 
              }
            ],
        })
    }
    render() {
      return (
        <div className="wxVisit">
          <div className="LineChart"style={{width:"90%",height:"600px"}} >
            <p style={{fontSize:"22px",margin:0,color:"464A53",fontWeight:"bold"}}>小程序访问趋势图</p>
            <div id="line" style={{height:"600px"}}></div>
          </div>
          <div className="menu">
            <Select style={{ width: 153 }} defaultValue="7" onChange={this.handleChange}>
              <Option value="7">最近一周</Option>
              <Option value="14">最近14天</Option>
              <Option value="30">最近30天</Option>
            </Select>
            <div className="quantity">
              <p>PV</p>
              <p>UV</p>
            </div>
          </div>
        </div> 
        
      )
    }
  }
  
  export default LineChart