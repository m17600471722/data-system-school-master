import React from 'react'
import { Upload, Icon, message,Modal } from 'antd'
import api from '../../config/apiConfig'
import Utils from '../../assets/js/utils'
import Cropper from '../cropper/cropper'
import './index.less'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class UploadImage extends React.Component {
  constructor (props) {
    super(props)
    this.isInit = false
    this.state = {
      fileList:this.props.imgs || [],
      previewVisible: false,
      previewImage: '',
      cropVisible:false,
      cropSrc:""
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { imgs = [] } = this.props
    if (imgs.length !== nextProps.imgs.length) {
      this.setState({
        fileList:nextProps.imgs
      })
      return
    }

    let isChange = false
    // 图片数组内容不一致
    imgs.map((item, index) => {
      if (item.url !== nextProps.imgs[index].url) {
        isChange = true
      }
    })
    if (isChange) {
      this.setState({
        fileList:nextProps.imgs
      })
    }
  }
  handleOk = (dataUrl) => {
    this.setState({
      cropVisible: false,
    });
    this.blob= dataUrl;   //  this.blob既是裁剪后的图片，也可以作为裁剪结束的标志
  }
  onRemove=()=>{
    this.props.onChange && this.props.onChange([])
  }
  beforeUpload = (file) => {
      if(this.props.imgType === 'live') {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传图片文件');
      }
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isLt2M) {
        message.error('图片最大 4MB!');
      }
      return isJpgOrPng && isLt2M;
    }
    
    let imageType = ['image/jpeg','image/png','image/jpg'];
    let isImage = imageType.findIndex(o => o === file.type) !== -1;
    if (!isImage) {
      message.error('请选择正确的图片类型!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
      message.error('图片大小不能超过4M!');
      return false;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file); 
    let _this = this;
    reader.onload = (e) => {
      _this.setState({
        cropSrc: e.target.result,
        cropVisible: true,
      })
    }
    return new Promise((resolve, reject) => {
      let index = setInterval(() => {
        if(this.blob){  // 监听裁剪是否完成
          window.clearInterval(index)
          this.blob.uid = file.uid;
          resolve(this.blob);   // 执行后续的上传操作
        }
      },500)
    })
  }

  handleChange = ({ fileList }) => {
    fileList.forEach(imgItem => {
      if(imgItem.response && imgItem.response.success !== true ){
        imgItem.status ="error"
        message.error('图片上传失败，请重新上传！')
        this.props.onChange && this.props.onChange([])
        return
      }
      if (imgItem && imgItem.status === 'done' && imgItem.response && imgItem.response.result) {
        let obj = {
          uid:imgItem.uid,
          url:imgItem.response.result
        }
        this.props.onChange && this.props.onChange([obj])
      } else {
        imgItem.status ="error"
        this.props.onChange && this.props.onChange([])
        return
      }
    })
    this.blob=null
    this.setState({ 
      fileList,
      cropSrc:""
     })
  }
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  render () {
    const { quantity = 1,imgType,source,disabledup } = this.props
    const { fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>点击上传</div>
      </div>
    )
    return <div className="clearfix">
        <Upload
          accept='image/*'
          name={source ? 'qrCode' : 'images'}
          listType='picture-card'
          fileList={fileList}
          beforeUpload={this.beforeUpload}
          action={source ? api.decodeQrCode: api.uploadfile}
          headers={{"Authorization": Utils.getCookies('sessionId')}}
          onPreview={this.handlePreview}
          onRemove={this.onRemove}
          disabled={disabledup ? true :false}
          onChange={this.handleChange}>
          {fileList.length >= quantity ? null : uploadButton}
        </Upload>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>{this.setState({ previewVisible: false });}}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
        <Modal visible={this.state.cropVisible} footer={null} onCancel={()=>{this.setState({cropVisible:false})}} destroyOnClose>
          <Cropper src={this.state.cropSrc} onOk={this.handleOk} imgType={imgType}/>
        </Modal>
    </div>
  }
}

export default UploadImage
