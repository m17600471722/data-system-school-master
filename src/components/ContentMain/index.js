import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import PrivateRoute from '../PrivateRoute'
// 数据中心
const Dashboard = LoadableComponent(()=>import('../../routes/Center/dashboard'))
const Shcool = LoadableComponent(()=>import('../../routes/Center/school'))
const Classroom = LoadableComponent(()=>import('../../routes/Center/classroom'))
const OfficialAccounts = LoadableComponent(()=>import('../../routes/Center/officialAccounts'))
const Rest = LoadableComponent(()=>import('../../routes/Center/rest'))

// 院端管理
const Hospital = LoadableComponent(()=>import('../../routes/Administer/hospital'))
const Livecourses = LoadableComponent(()=>import('../../routes/Administer/livecourses'))
const UnderLine = LoadableComponent(()=>import('../../routes/Administer/under-line'))
const Videocourse = LoadableComponent(()=>import('../../routes/Administer/videocourse'))

// 用户
const UserManagement = LoadableComponent(()=>import('../../routes/User/userManagement'))
const UserPortrait = LoadableComponent(()=>import('../../routes/User/userPortrait'))
const BehaviorTrace = LoadableComponent(()=>import('../../routes/User/behaviorTrace'))
const Liveness = LoadableComponent(()=>import('../../routes/User/liveness'))
const RetentionRate = LoadableComponent(()=>import('../../routes/User/retentionRate'))

// 订单
const Indent = LoadableComponent(()=>import('../../routes/System/indent'))

// 系统管理
const Role = LoadableComponent(()=>import('../../routes/System/role'))
const Personnel = LoadableComponent(()=>import('../../routes/System/personnel'))
const Menu = LoadableComponent(()=>import('../../routes/System/menu'))
// 404
const ErrorPage = LoadableComponent(()=>import('../../routes/ErrorPage/404'))
const NoAuthority = LoadableComponent(()=>import('../../routes/ErrorPage/noAuthority'))

@withRouter
class ContentMain extends React.Component {
  render () {
    return (
      <div style={{position: 'relative'}}>
        <Switch>
          <PrivateRoute exact path='/center/dashboard' component={Dashboard}/>
          <PrivateRoute exact path='/center/shcool' component={Shcool}/>
          <PrivateRoute exact path='/administer/hospital' component={Hospital}/>
          <PrivateRoute exact path='/center/officialAccounts' component={OfficialAccounts}/>
          <PrivateRoute exact path='/center/rest' component={Rest}/>
          <PrivateRoute exact path='/administer/livecourses' component={Livecourses}/>
          <PrivateRoute exact path='/administer/under-line' component={UnderLine}/>
          <PrivateRoute exact path='/administer/videocourse' component={Videocourse}/>
          <PrivateRoute exact path='/center/classroom' component={Classroom}/>

          <PrivateRoute exact path='/system/role' component={Role}/>
          <PrivateRoute exact path='/system/personnel' component={Personnel}/>
          <PrivateRoute exact path='/system/menuManage' component={Menu}/>
          <PrivateRoute exact path='/system/indent' component={Indent}/>

          <PrivateRoute exact path='/user/userManagement' component={UserManagement}/>
          <PrivateRoute exact path='/user/userPortrait' component={UserPortrait}/>
          <PrivateRoute exact path='/user/behaviorTrace' component={BehaviorTrace}/>
          <PrivateRoute exact path='/user/liveness' component={Liveness}/>
          <PrivateRoute exact path='/user/retentionRate' component={RetentionRate}/>
          <PrivateRoute exact path='/noAuthority' component={NoAuthority}/>
          <Redirect exact from='/' to='/center/dashboard'/>
          <PrivateRoute component={ErrorPage}/>
        </Switch>
      </div>
    )
  }
}

export default ContentMain