import React from 'react'
import { Upload, Icon, message,Button } from 'antd'
import api from '../../config/apiConfig'
import Utils from '../../assets/js/utils'
import './index.less'

class UploadImage extends React.Component {
  constructor (props) {
    super(props)
    this.isInit = false
    this.state = {
      fileList:this.props.video || [],
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { video = [] } = this.props
    
    if (video.length !== nextProps.video.length) {
      this.setState({
        fileList:nextProps.video
      })
      return
    }

    let isChange = false
    // 图片数组内容不一致
    video.map((item, index) => {
      if (item.url !== nextProps.video[index].url) {
        isChange = true
      }
    })
    if (isChange) {
      this.setState({
        fileList:nextProps.video
      })
    }
  }
  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'video/mp4'
    if (!isJpgOrPng) {
      message.error('只能上传mp4格式视频文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 500;
    if (!isLt2M) {
      message.error('视频最大 500MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = ({ fileList,event }) => {
    const file = fileList[fileList.length - 1]
    if (file && file.status === 'done' && file.response && file.response.success === true) {
      if (file.response.success) {
        const videos = fileList.map((item) => {
          return {
            uid:item.uid,
            url:item.response ? item.response.result : '',
          }
        })
        this.props.onChange && this.props.onChange(videos)
      } else {
        fileList = fileList.filter((file) => {
          if (file.response) {
            return file.response.success
          }
          return true
        })
        message.error(file.response.resultMessage)
      }
    } else if (file && file.status === 'error' || file && file.response && file.response.success === false) {
      fileList = fileList.filter(file => !file.response && file.status !== 'error')
      message.error('上传失败或上传文件过大')
      this.props.onChange && this.props.onChange(fileList)
    } else {
      this.props.onChange && this.props.onChange(fileList)
    }
    this.setState({ fileList })
  }


  render () {
    const { fileList } = this.state
    const { quantity = 1 } = this.props
    return <div className="clearfix">
        <Upload
          accept='video/*'
          name='video' 
          multiple={true}
          fileList={fileList}
          beforeUpload={this.beforeUpload}
          action={api.uploadvideo}
          headers={{"Authorization": Utils.getCookies('sessionId')}}
          onChange={this.handleChange}>
            {fileList.length >= quantity ? null :  <Button>
            <Icon type="upload" /> 上传
          </Button>}
        </Upload>
    </div>
  }
}

export default UploadImage
