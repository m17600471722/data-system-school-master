import React from 'react'
import { Result, Button } from 'antd'
import {Link} from 'react-router-dom'

class NoAuthority extends React.Component {
  render () {
    return (
      <Result
        status="403"
        title="403"
        subTitle="对不起, 您没有此页面的访问权限."
        extra={<Button type="primary"><Link to='/center/dashboard'>返回</Link></Button>}
      />
    )
  }
}

export default NoAuthority