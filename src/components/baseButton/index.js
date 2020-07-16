import React, { Component } from 'react'
import { Button } from 'antd'

export default class BaseButton extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  onClick=(item)=>{
    this.props.openButtonDetail(item.attribute)
  }
  initButton = ()=>{
    return (
      this.props.buttonList.map((item,index)=>{
        return <Button type={item.type} onClick={()=> this.onClick(item)} key={index} style={{marginLeft:10}}>{item.text}</Button>
      })
      
    )
  }
  render(){
    return <div>
      {this.initButton()}
    </div>
  }
}