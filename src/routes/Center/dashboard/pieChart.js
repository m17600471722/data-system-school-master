import React from 'react'
import Echarts from 'echarts';
import axios from '../../../assets/js/axios'
import api from '../../../config/apiConfig'

class LineChart extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            dataX:[],
            dataY:[]
        }
    }
    componentDidMount(){
        this.getdataList()
    }
    getdataList = ()=>{
        // 数据总量
        axios.ajax({
            url:api.getDailyVisitDistribution,
            method:"post",
        }).then((res)=>{
            let data = res.result;
            let dataX = [],dataY = [],obj = {}
            data.map(item=>{
                obj = {}
                for(var d in item) {
                    obj.value = item[d]
                    obj.name = d
                    dataX.push(d)
                }
                dataY.push(obj)
            })
            this.setState({
                dataX,
                dataY
            })
            this.loadEchart()
        }).catch(err =>{
            console.log(err)
        })
    }
    loadEchart =()=> {
        this.state.myChart = Echarts.init(document.getElementById("pie"));
        this.state.myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {              
                orient: 'vertical',
                left: 10,
                data: this.state.dataX,
                textStyle:{
                    color: '#6A707E'
                },
            },
            //设置饼状图每个颜色块的颜色
            color : [ '#8B6CFF', '#FF653F', '#37B8AA', '#FE60AD', '#02AFF0', '#FFA421' ],
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['35%', '55%'],
                    center: ['50%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: this.state.dataY,
                }
            ]
        })
    }
    render() {
        return (
            <div style={{width:"350px"}} >
                <div id="pie" style={{height:"400px"}}></div>
            </div>
        )
    }
  }
  
  export default LineChart