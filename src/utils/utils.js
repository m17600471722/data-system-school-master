
import moment from 'moment';


function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split(".").length > 1 ? s1.split(".")[1].length : 0;
  m += s2.split(".").length > 1 ? s2.split(".")[1].length : 0;
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}


/**
 * 生成指定区间的随机整数
 * @param min
 * @param max
 * @returns {number}
 */
export function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 计算提示框的宽度
 * @param str
 * @returns {number}
 */
export function calculateWidth(arr){
  return 30 + arr[0].length*15
}

/**
 * 图片预加载
 * @param arr
 * @constructor
 */
export function preloadingImages(arr) {
  arr.forEach(item=>{
    const img = new Image()
    img.src = item
  })
}

// 根据单选框的值返回起始和结束的时间
export function getTimeDistance(type) {
  var today = moment().subtract('days', 1).format('YYYY-MM-DD');
  var lastDay = moment().subtract('days', type).format('YYYY-MM-DD');
  return [moment(lastDay, 'YYYY-MM-DD'), moment(today, 'YYYY-MM-DD')]
}

// 判断时间选择器里的时间是否与单选框的值匹配
export function getTimeDay(type){
  var time = [];
  var today = moment().subtract('days', 1).format('YYYY-MM-DD');
  time.push({lastTime:moment().subtract('days', 7).format('YYYY-MM-DD'),day:"7"});
  time.push({lastTime:moment().subtract('days', 14).format('YYYY-MM-DD'),day:"14"});
  time.push({lastTime:moment().subtract('days', 30).format('YYYY-MM-DD'),day:"30"});
  if(type[1]===today){
    let day
    time.map(item=>{
      if(item.lastTime==type[0]){
        day = item.day
      }
    })
    return day
  }else{
    return ""
  }
}


export function formatTime(val){
  let obj = {
    endDate:moment().subtract('days', 1).format('YYYY-MM-DD'),
    startDate:moment().subtract('days', val).format('YYYY-MM-DD')
  }
  return obj
}

// 根据select值返回echarts的X轴显示的值
export function recentlyData(val){
  let num = parseInt(val);
  let arr = []
  for(var i = num; i > 0; i --){
    arr.push(moment().subtract('days', i).format('MM-DD'))
  }
  return arr
}