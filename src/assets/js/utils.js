import React from 'react'
import Cookies from 'js-cookie'
import { Select,Radio } from 'antd'
import CryptoJS from 'crypto-js'
import XLSX from 'xlsx' 
import moment from 'moment'
const Option = Select.Option

function doHandleMonth(month){
　　var m = month
　　if(month.toString().length == 1){
　　　　m = "0" + month
　　}
　　return m
}

export default {
  /*
  * 获取cookies
  * */
  getCookies (key) {
    return Cookies.get(key)
  },
    /*
  * 设置Cookies
  * */
  setCookies (key, value, expiresTime) {
    if (expiresTime){ 
        let seconds = expiresTime
        let expires = new Date(new Date() * 1 + seconds * 1000)
        return Cookies.set(key, value, { expires: expires })
    }
    return Cookies.set(key, value)
  },
  /*
  * 移除Cookies
  * */
  removeCookies (key) {
    return Cookies.remove(key)
  },
  renderButton (arr,type) {
    return arr.filter(item => {
      if(type == item.type){
        if (item.name === '删除' || item.name === '密钥' || item.name === '拒绝'){
          item.class = 'danger'
          item.ghost = true
        }else if (item.name === '数据' || item.name === '发送' || item.name === '绑定' || item.name === '同意'|| item.name === '添加'){
          item.class = 'primary'
          item.ghost = true
        } else {
          item.class = 'primary'
        }
        return item
      }
    })
  },
  initHeaderButton (list) {
    let arr = []
    list.forEach(item => {
      let obj = {}
      if(item.name === '选择共享内容'){
        obj.type = "default"
        obj.text = item.name
        obj.attribute = "share"
      } else if(item.name === '已选共享内容'){
        obj.type = "default"
        obj.text = item.name
        obj.attribute = "shareSelected"
      } else if(item.name === '导出'){
        obj.type = "primary"
        obj.text = item.name
        obj.attribute = "export"
      } else if(item.name === '便民首页'){
        obj.type = "primary"
        obj.text = item.name
        obj.attribute = "poster"
      }else {
        obj.type = "primary"
        obj.text = item.name
        obj.attribute = "establish"
      }
      arr.push(obj)
    })
    return arr
  },
  encrypt (word,keys) {
    // 加密
    var key = CryptoJS.enc.Utf8.parse(keys);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  decrypt (word,keys) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
  debounce (fun, delay=500) {
    let time
    return function (...args) {
      if (time) {
        clearTimeout(time)
      }
      time = setTimeout(() => {
        fun.apply(this, args)
      }, delay)
    }
  },
  formateDate(data) {
    const time =new Date(data)
    var year = time.getFullYear(),
        month = time.getMonth() + 1,//月份是从0开始的
        day = time.getDate(),
        hour = time.getHours()<10 ? '0'+time.getHours() : time.getHours(),
        min = time.getMinutes()<10 ? '0'+time.getMinutes() : time.getMinutes(),
        sec = time.getSeconds()<10 ? '0'+time.getSeconds() : time.getSeconds();
    var newTime = year + '-' +
        month + '-' +
        day + ' ' +
        hour + ':' +
        min + ':' +
        sec;
    return newTime;
  },
  formateDates(time){
    if(!time)return '';
    let date = new Date(time);
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  },
  pagination(data,callback){
      return {
          onChange:(page, pageSize)=>{
            callback(page, pageSize)
          },
          onShowSizeChange:(current, size)=>{
            callback(current, size)
          },
          current:data.currentPage,
          pageSize:data.pageSize,
          total: data.result.total,
          showTotal:()=>{
              return `共${data.result.total}条`
          },
          showQuickJumper:true,
          showSizeChanger:true
      }
  },
  getAllDayList(){
    var dateList = [];
    let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(startDate.getDate() + 60);
    while ((endDate.getTime() - startDate.getTime()) >= 0) {
        let month = (startDate.getMonth() + 1).toString().length === 1 ? "0" + (startDate.getMonth() + 1).toString() : (
            startDate.getMonth() + 1);
        let year = startDate.getFullYear()
        let myddy=startDate.getDay();//获取存储当前日期
        var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
        let day = startDate.getDate().toString().length === 1 ? "0" + startDate.getDate() : startDate.getDate()
        dateList.push(`${year}-${month}-${day} ${weekday[myddy]}`);
        startDate.setDate(startDate.getDate() + 1);
    }
    return dateList
  },
  getDay(day){
　　var today = new Date()
　　var targetday_milliseconds=today.getTime() + 1000*60*60*24*day
　　today.setTime(targetday_milliseconds); //注意，这行是关键代码
　　var tYear = today.getFullYear()
　　var tMonth = today.getMonth()
　　var tDate = today.getDate()
　　tMonth = doHandleMonth(tMonth + 1)
　　tDate = doHandleMonth(tDate)
　　return tYear+"-"+tMonth+"-"+tDate
  },
  // 格式化金额,单位:分(eg:430分=4.30元)
  formatFee(fee, suffix = '') {
      if (!fee) {
          return 0;
      }
      return Number(fee).toFixed(2) + suffix;
  },
  // 格式化公里（eg:3000 = 3公里）
  formatMileage(mileage, text) {
      if (!mileage) {
          return 0;
      }
      if (mileage >= 1000) {
          text = text || " km";
          return Math.floor(mileage / 100) / 10 + text;
      } else {
          text = text || " m";
          return mileage + text;
      }
  },
  // 隐藏手机号中间4位
  formatPhone(phone) {
      phone += '';
      return phone.replace(/(\d{3})\d*(\d{4})/g, '$1***$2')
  },
  // 隐藏身份证号中11位
  formatIdentity(number) {
      number += '';
      return number.replace(/(\d{3})\d*(\d{4})/g, '$1***********$2')
  },
  getOptionList(data,isDelAll){
      if(!data){
          return [];
      }
      let options = [<Option value="-1" key="d_all">全部</Option>]
      data.forEach((item)=>{
          options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
      })
      if(isDelAll){
        options.splice(0, 1)
      }
      return options;
  },
  FormatDateTime(data){
    let vals = data
    if(data.rangePicker && data.rangePicker.length === 2){
      vals.startDate = moment(data.rangePicker[0]).format('YYYY-MM-DD')
      vals.endDate = moment(data.rangePicker[1]).format('YYYY-MM-DD')
    }
    delete vals.rangePicker
    delete vals.radio
    return vals
  },
  getRadioList(data){
    if(!data){
        return []
    }
    let options = []
    data.forEach((item)=>{
        options.push(<Radio.Button value={item.id} key={item.id}>{item.name}</Radio.Button>)
    })
    return options;
  },
  /**
   * ETable 行点击通用函数
   * @param {*选中行的索引} selectedRowKeys
   * @param {*选中行对象} selectedItem
   */
  updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
      if (selectedIds) {
          this.setState({
              selectedRowKeys,
              selectedIds: selectedIds,
              selectedItem: selectedRows
          })
      } else {
          this.setState({
              selectedRowKeys,
              selectedItem: selectedRows
          })
      }
  },
  outExcel (res,name) {
    console.log(name)
    const data = new Uint8Array(res)
    const workbook = XLSX.read(data, { type:'array' })
    const date = new Date()
    const formatDate = moment(date).format('YYYYMMDDHHmmss')
    const names = name || ""
    XLSX.writeFile(workbook, names + '.xls')
  },
  downurl (url,name='二维码') { 
    var img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous')
    img.src = url
    img.onload = function() {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      // 将img中的内容画到画布上
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      // 将画布内容转换为base64
      var base64 = canvas.toDataURL()
      // 创建a链接
      var a = document.createElement('a')
      a.href = base64
      a.download = name
      // 触发a链接点击事件，浏览器开始下载文件
      a.click()
    }
  }
}