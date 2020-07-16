import axios from 'axios'
import { message } from 'antd'
import utils from './utils'
import qs from 'qs'
import {HashRouter} from 'react-router-dom'
const router = new HashRouter()
var invalid = true
axios.defaults.timeout = 20000;
axios.defaults.withCredentials = false
let pending = []; 
// 禁止重复调用
let cancelToken = axios.CancelToken;
let removePending = (ever) => {
  for(let p in pending){
    if(pending[p].u === ever.url + '&' + ever.method) { 
      pending[p].f(); 
      pending.splice(p, 1)
    }
  }
}
//http request 拦截器
axios.interceptors.request.use(
    config => {
      let loginpath=/adminLogin/g.test(config.url)
      const Authorization = utils.getCookies('sessionId')
      let url = config.url
      if(url.includes('/admin/hospital/')){
        config.headers = {
          'Content-Type':'application/json;charset=utf-8'
        }
      }else if(/bannerUpdate|bannerSave|hospitalUpdate|courseSave|courseUpdates|signGuide|operationPlatform/.test(url) || /back/.test(url)){
        config.headers = {
          'Content-Type':'application/json;charset=utf-8'
        }
      } else{
        config.headers = {
          'Content-Type':'application/x-www-form-urlencoded'
        }
        config.data = qs.stringify(config.data)
      }


      if (Authorization) {
        config.headers['Authorization'] = Authorization

      } else{
        if(!loginpath){
          message.error("登录失效，请重新登录")
          router.history.push('/login')
        }
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  )
  //http response 拦截器
  axios.interceptors.response.use(
    response => {
      // removePending(response.config)
      if((response.data.resultCode === '0000' && response.data.success)){
        invalid = true
        return Promise.resolve(response.data)
      }
      if(response.data.resultCode === '9001'){
        if(invalid){
          message.error('登录失效,请重新登录！')
          invalid = false
        }
        utils.removeCookies('Authorization')
        router.history.push('/login')
      } else{
        if(response.data.resultMessage){
          message.error(response.data.resultMessage)
        } else {
          return Promise.resolve(response.data)
        }
      }
      return Promise.reject(response.data)
    },
    error => {
      message.error('链接超时,请稍后尝试')
      return Promise.reject(error)
    }
  )

  
export default class Axios {
    static ajax(options){
      return new Promise((resolve,reject)=>{
          axios({
            url:options.url,
            method:options.method,
            params: (options.data && options.data.params) || null,
            data: options.method.toUpperCase() === 'POST' || options.method.toUpperCase() === 'PUT' ? options.data : null,
          }).then((response) => {
              resolve(response)
            }).catch((err) => {
              reject(err);
            })
      });
    }
    static ajaxExl(options){
      return new Promise((resolve,reject)=>{
          axios({
            url:options.url,
            method:options.method,
            responseType: 'arraybuffer',
            params: (options.data && options.data.params) || null,
            data: options.method.toUpperCase() === 'POST' || options.method.toUpperCase() === 'PUT' ? options.data : null,
          }).then((response) => {
              resolve(response)
            }).catch((err) => {
              reject(err);
            })
      });
    }

}