import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {unregister} from './registerServiceWorker';
import {HashRouter} from 'react-router-dom'
import { Provider} from 'mobx-react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import store from './store'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

ReactDOM.render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      <Provider {...store}>
        <App/>
      </Provider>
    </ConfigProvider>
  </HashRouter>,
  document.getElementById('root'));
  unregister();
