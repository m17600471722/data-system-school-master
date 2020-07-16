let baseURL
let schoolUrl
let huomaUrl
let appId
let h5School
if(/mjtest/.test(window.location.hostname)) {
  baseURL = `${window.location.origin}/api`
  schoolUrl = 'https://schooltest.yunxiaoos.com/yunxiaoos/onlineDist'
  huomaUrl = 'http://huomatest.yunxiaoos.com'
  h5School = 'https://schooltest.yunxiaoos.com/yunxiaoos/coninfo'
  appId = "wx5196c0bea98784f6"
}else if(/mj/.test(window.location.hostname)) {
  baseURL = `${window.location.origin}/api`
  schoolUrl = 'https://school.yunxiaoos.com/yunxiaoos/onlineDist'
  huomaUrl = 'https://huoma.yunxiaoos.com'
  h5School = 'https://school.yunxiaoos.com/yunxiaoos/coninfo'
  appId = 'wx790895c1f196f682'
}else{
  // baseURL = 'https://mjtest.yunxiaoos.com/api'
  baseURL = 'https://mj.yunxiaoos.com/api'
  schoolUrl = 'https://schooltest.yunxiaoos.com/yunxiaoos/onlineDist'
  huomaUrl = 'http://huomatest.yunxiaoos.com'
  h5School = 'https://schooltest.yunxiaoos.com/yunxiaoos/coninfo'
  appId = "wx5196c0bea98784f6"
  baseURL = '/api'
  // baseURL = 'http://10.10.4.146:8080'
}
const config = {
    isProd: () => {
      return process.env.NODE_ENV === 'production';
    },
    isDev: () => {
      return process.env.NODE_ENV === 'development';
    },
    globalVariable: {
      baseHost: baseURL,
      schoolUrl,
      huomaUrl,
      h5School,
      appId,
      key:'khAIM0ojtmWe68UD',
      //登录token失效时间
      sessionExpireTime:86400,
    }
  };
  
  export default config
  