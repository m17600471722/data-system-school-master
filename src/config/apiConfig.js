import config from './index.js'

const apiConfig ={
    adminLogin:config.globalVariable.baseHost+"/operationPlatform/login",    //登录
    appVisitCurve:config.globalVariable.baseHost+"/operationPlatform/dashboard/appVisitCurve",    //小程序访问曲线
    appVisitUserCount:config.globalVariable.baseHost+"/operationPlatform/dashboard/appVisitUserCount",    //小程序访问数(当日实时)
    courseStats:config.globalVariable.baseHost+"/operationPlatform/dashboard/courseStats",    //面授课程签到数(当日实时)
    userStats:config.globalVariable.baseHost+"/operationPlatform/dashboard/userStats",    //用户统计
    hospitalStats:config.globalVariable.baseHost+"/operationPlatform/dashboard/hospitalStats",    //用户统计
    hospitalVisitTop5:config.globalVariable.baseHost+"/operationPlatform/dashboard/hospitalVisitTop5",    //医院top5
    yesterdayHospitalDataStats:config.globalVariable.baseHost+"/operationPlatform/hospital/yesterdayHospitalDataStats",    //昨日医院数据统计
    hospitalDetailPage:config.globalVariable.baseHost+"/operationPlatform/hospital/hospitalDetailPage",    //医院明细(分页)
    hospitalDataStatsPage:config.globalVariable.baseHost+"/operationPlatform/hospital/hospitalDataStatsPage",    //医院数据统计(分页)
    exportHospitalData:config.globalVariable.baseHost+"/operationPlatform/hospital/exportHospitalData",    //导出excel-医院数据统计
    exportHospitalDetail:config.globalVariable.baseHost+"/operationPlatform/hospital/exportHospitalDetail",    //导出excel - 医院明细
    hospitalListSearch:config.globalVariable.baseHost+"/operationPlatform/hospital/listHospitalForLike",    // 关键词搜索医院
    dataDetailPage:config.globalVariable.baseHost+"/operationPlatform/course/video/dataDetailPage",    // 视频课程-明细数据(分页)
    exportVideoCourseDetail:config.globalVariable.baseHost+"/operationPlatform/course/video/exportVideoCourseDetail",    // 导出excel - 视频课程明细数据
    yesterdayDataStats:config.globalVariable.baseHost+"/operationPlatform/course/video/yesterdayDataStats",    // 视频课程-昨日关键数据
    uploadfile:config.globalVariable.baseHost+"/upload/uploadfile/",    // 上传图片
    offlineyesterdayData:config.globalVariable.baseHost+"/operationPlatform/course/offline/yesterdayDataStats",    // 面授课程-昨日关键数据
    offlineExportVideoCourse:config.globalVariable.baseHost+"/operationPlatform/course/offline/exportVideoCourseDetail",    // 导出excel - 面授课程明细数据
    offlineDataDetailPage:config.globalVariable.baseHost+"/operationPlatform/course/offline/dataDetailPage",    // 导出excel - 面授课程明细数据
    liveDataDetailPage:config.globalVariable.baseHost+"/operationPlatform/course/live/dataDetailPage",    // 直播课程-明细数据(分页)
    liveExportVideoCourseDetail:config.globalVariable.baseHost+"/operationPlatform/course/live/exportVideoCourseDetail",    // 导出excel - 直播课程明细数据
    liveYesterdayDataStats:config.globalVariable.baseHost+"/operationPlatform/course/live/yesterdayDataStats",    // 直播课程-昨日关键数据

    getDailyVisitDistribution:config.globalVariable.baseHost+"/operationPlatform/dashboard/getYesterdayVisitDistribution",    // 用户数据总量

}

export default apiConfig;
