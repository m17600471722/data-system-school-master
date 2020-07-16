import React, { Component } from 'react'
import { Input, Select, Form, Button, Cascader, DatePicker,Radio} from 'antd'
import moment from 'moment'
import { getTimeDistance,getTimeDay } from '../../utils/utils';
import Utils from '../../assets/js/utils'
import axios from '../../assets/js/axios'
import api from '../../config/apiConfig'
import styles from './style.less';
const FormItem = Form.Item
const { RangePicker } = DatePicker
const { RadioGroup } = Radio
class FilterForm extends Component{
    state = {
        options:[],
        value: undefined,
        selList:[],
    }
    handleFilterSubmit = ()=>{
        let fieldsValue = this.props.form.getFieldsValue()
        this.props.filterSubmit(fieldsValue)
    }
    handleSearch = value => {
      this.props.searchContents(value)
    }
    onChange = e =>{
        this.props.form.setFieldsValue({
            rangePicker: getTimeDistance(e.target.value),
        });
    }
    ChangePicker = (date, dateString) =>{
        this.props.form.setFieldsValue({
            radio: getTimeDay(dateString),
        });
    }
    getItemsValue = ()=>{    
        const valus= this.props.form.getFieldsValue();       
        return valus;
    }
    faceCourseReportToExcel = (val) =>{
        axios.ajaxExl({
            url:api.faceCourseReportToExcel,
            method:"post",
            data:{
            ...val
            }
        }).then((res)=>{
            Utils.outExcel(res)
        }).catch(err =>{
            console.log(err)
        })
    }
    deriveData = ()=>{
        let data = this.props.form.getFieldsValue()
        let val = Utils.FormatDateTime(data)
        console.log(this.props.downloadApi)
        axios.ajaxExl({
            url:this.props.downloadApi,
            method:"post",
            data:{
              ...val
            }
          }).then((res)=>{
            let data  = Utils.FormatDateTime(this.props.form.getFieldsValue())
            let name  = this.props.title+" "+data.startDate+"~"+data.endDate
            Utils.outExcel(res,name)
          }).catch(err =>{
            console.log(err)
          })
      }
    handleSearch = (val)=>{
        axios.ajax({
          url:api.hospitalListSearch,
          method:"post",
          data:{
            hospitalName:val
          }
        }).then((res)=>{
            if(res.result.length > 0){
                let arr = []
                res.result.forEach(item =>{
                    let obj = {
                        id:item.id,
                        name:item.name
                    }
                    arr.push(obj)
                })
                this.setState({
                    selList:arr
                })
            } else {
                this.setState({
                    selList:[]
                })
            }
        }).catch(err =>{
          console.log(err)
        })
      }
    initFormList = ()=>{
        const { getFieldDecorator } = this.props.form

        return (
            <Form layout="inline" className="refer"  style={{display:"flex",justifyContent:"space-between"}}>
                {/* <FormItem label="选择时间">
                    {getFieldDecorator('radio',{
                        initialValue: "7"
                    })(
                        <Radio.Group buttonStyle="solid" onChange={this.onChange}>
                            <Radio.Button value="7">7天</Radio.Button>
                            <Radio.Button value="14">14天</Radio.Button>
                            <Radio.Button value="30">30天</Radio.Button>
                        </Radio.Group>,
                    )}
                </FormItem> */}
                <FormItem label="选择时间" style={{width:"45%",display:"flex",justifyContent:"start"}}>
                    {getFieldDecorator('rangePicker',{
                        initialValue:getTimeDistance(7)
                    })(
                        <RangePicker style={{width:"90%"}} onChange={this.ChangePicker} format="YYYY-MM-DD"/>
                    )}
                </FormItem>
                <FormItem label="" style={{width:"35%"}}>
                    {
                        getFieldDecorator("hospitalId")(
                            <Select
                                style={{ width: "100%",padding:"11px 0",marginLeft:"10px" }}
                                placeholder="请输入医院名称"
                                showSearch
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.handleSearch}
                                notFoundContent={null}
                            >
                               {Utils.getOptionList(this.state.selList,true)}
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem style={{marginTop:"9px",width:"20%",textAlign:"right"}}>
                    <Button  className="inquire" style={{ margin: '0 20px' }} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button  onClick={this.deriveData} className="upload">导出</Button>
                </FormItem>
            </Form>  
        )
    }
    render(){
        return (
            this.initFormList()
        );
    }
}
export default Form.create({})(FilterForm);