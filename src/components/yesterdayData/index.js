import React, { Component } from 'react'
import { Button } from 'antd'
import {  Col, Row, Card ,Avatar } from 'antd'
const { Meta } = Card;
import axios from '../../assets/js/axios'
import api from '../../config/apiConfig'

export default class yesterDay extends Component {
    constructor (props) {
        super(props)
        this.state = {
            yesterNum:{}
        }
    }
    componentDidMount(){
        this.yesterdayHospitalData()
    }
    yesterdayHospitalData = ()=>{
        axios.ajax({
            url:api.yesterdayHospitalDataStats,
            method:"post",
        }).then((res)=>{
            this.setState({
                yesterNum:res.result
            })
        }).catch(err =>{
            console.log(err)
        })
    }
    render(){
        return (
            <Row gutter={24}>
                <Col span={6}>
                <Card bordered={false}>
                    <Meta
                    className="PurpleCard FontSize"
                    style={{textAlign:"center",}}
                    title={this.state.yesterNum.yesterdayLoginHospitalCount}
                    description="昨日登陆中台医院数"/>
                </Card>
                </Col>
                <Col span={6}>
                <Card bordered={false}>
                    <Meta
                    className="GreenCard FontSize"
                    style={{textAlign:"center"}}
                    title={this.state.yesterNum.yesterdayUploadCourseHospitalCount}
                    description="昨日上传课程医院数"/>
                </Card>
                </Col>
                <Col span={6}>
                <Card bordered={false}>
                    <Meta
                    className="BlueCard FontSize"
                    style={{textAlign:"center"}}
                    title={this.state.yesterNum.yesterdayPushMessageCount}
                    description="昨日推送消息数"/>
                </Card>
                </Col>
                <Col span={6}>
                <Card bordered={false}>
                    <Meta
                    className="PinkCard FontSize"
                    style={{textAlign:"center"}}
                    title={this.state.yesterNum.yesterdayPushMessageUserCount}
                    description="昨日用户数"/>
                </Card>
                </Col>
            </Row>
        )
    }
}