import React, {Component} from 'react'
import { Button } from 'antd'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import './index.less'

export default class CropperImg extends Component {
  state={
    boxSize:{}
  }
  handleOk = () => {
    //将裁剪的图片转成blob对象
    this.refs.cropper.getCroppedCanvas({
      fillColor:"#ffffff"
    }).toBlob(async (blob) => {
      this.props.onOk(blob);
    },"image/jpeg");
  }
 
  render() {
    const { src ,imgType} = this.props;
    console.log(imgType)
    let proportion = 1/1
    if(imgType === 'banner'){
      proportion = 2/1
    } else if(imgType === 'header'){
      proportion = 8/11
    } else if(imgType === 'course'){
      proportion = 3/2
    } else if(imgType === 'live'){
      proportion = 10/17
    } else if(imgType === 'cover'){
      proportion = 16/9
    }
    return (
      <div className="cropper-wrap">
        <div className="cropper-container">
          <Cropper
            ref='cropper'
            viewMode={1}
            autoCropArea={1}
            aspectRatio={proportion}
            src={src}
            style={{height: 400, width: '100%'}}
            guides={false}
            crop={()=>{this.setState({boxSize:this.refs.cropper.getData({rounded:true})})}}
            preview=".cropper-preview"
          />
        </div>
        <div className="box-size">
          <div className="text">长度:{this.state.boxSize && this.state.boxSize.width ? this.state.boxSize.width : 0}</div>
          <div className="text">宽度:{this.state.boxSize && this.state.boxSize.height ? this.state.boxSize.height : 0}</div>
        </div>
        <div className="preview-container">
          <div className="cropper-preview" />
        </div>
        <Button onClick={this.handleOk} type="primary">确认</Button>
      </div>
    );
  }
}