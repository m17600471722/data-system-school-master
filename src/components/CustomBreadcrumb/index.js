import React from 'react'
import {Breadcrumb} from 'antd'
import {Link} from 'react-router-dom'

const CustomBreadcrumb = (props)=>(
  <Breadcrumb style={{padding:'0 16px 0 16px'}}>
    {/* <Breadcrumb.Item><Link to='/home'>首页</Link></Breadcrumb.Item> */}
    {props.arr && props.arr.map(item=>{
      if ((typeof item) === 'object'){
        return <Breadcrumb.Item key={item.title}>
          {item.to ? <Link to={item.to}>{item.title}</Link> : item.title}
        </Breadcrumb.Item>
      } else {
        return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
      }
    })}
  </Breadcrumb>
)
export default CustomBreadcrumb