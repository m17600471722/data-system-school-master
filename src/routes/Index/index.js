import React from 'react'
import {Layout} from 'antd'
import SiderNav from '../../components/SiderNav'
import ContentMain from '../../components/ContentMain'
import HeaderBar from '../../components/HeaderBar'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { inject, observer} from 'mobx-react'
import {toJS} from "mobx"

const {Sider, Header, Content, Footer} = Layout

@inject('appStore') @observer
class Index extends React.Component{
  state = {
    collapsed: false,
    theme:"light"
  }
  componentDidMount(){
    // this.IsFooter()
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  render() {
    const { appStore } = this.props
    const { theme,collapsed } = this.state
    let breadcrumb = toJS(appStore.breadcrumb)
    return (
      <div id='page'>
        <Layout> 
          <Sider 
            collapsible
            trigger={null}
            theme={theme}
            style={{
              overflow: 'auto',
              height: '100vh',
            }}
            collapsed={collapsed}
          >
            <SiderNav collapsed={collapsed}  history ={this.props.history}/>
          </Sider>
          <Layout style={{height:'calc(100vh)',overflow:'auto'}}> 
            <Header style={{background: '#fff', padding: '0 16px'}}>
              <HeaderBar collapsed={collapsed} onToggle={this.toggle}/>
            </Header>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
              {
                breadcrumb.length > 1 ? <CustomBreadcrumb arr={breadcrumb}/> : null
              }
              <ContentMain/>
              <Footer style={{textAlign: 'center'}}></Footer>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
export default Index