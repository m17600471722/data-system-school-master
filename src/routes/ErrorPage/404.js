import React from 'react'
import { Result, Button } from 'antd'
import {Link} from 'react-router-dom'

class ErrorPage extends React.Component {
  render () {
    return (
      <Result
        status="404"
        title="404"
        subTitle="对不起, 该页面不存在."
        extra={<Button type="primary"><Link to='/center/dashboard'>返回</Link></Button>}
      />
    )
  }
}

export default ErrorPage