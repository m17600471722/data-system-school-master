import React, { Component } from 'react'
import { Input, Select, Form, Button, Checkbox, Cascader, DatePicker,Radio} from 'antd'
import moment from 'moment'
import Utils from '../../assets/js/utils'
import axios from '../../assets/js/axios'
import api from '../../config/apiConfig'
const FormItem = Form.Item
const { RangePicker } = DatePicker

class FilterForm extends Component{
    state = {
        options:[],
        value: undefined
    }
    UNSAFE_componentWillMount (){
        // this.getProvinces()
    }
    handleFilterSubmit = ()=>{
        let fieldsValue = this.props.form.getFieldsValue()
        this.props.filterSubmit(fieldsValue)
    }

    reset = ()=>{
        this.props.form.resetFields()
    }
    getProvinces = ()=>{
        axios.ajax({
          url:api.getProvinces,
          method:"post",
        }).then((res)=>{
          let arr =[]
          res.data.forEach(item => {
            let obj ={
              label:item.provinceName,
              value:item.provinceId,
              isLeaf:false
            }
            arr.push(obj)
          })
          this.setState({
            options:arr
          })
        })
    }
    handleSearch = value => {
      this.props.searchContents(value)
    }
    initFormList = ()=>{
        const { getFieldDecorator } = this.props.form
        const formList = this.props.formList
        const formItemList = []
        if (formList && formList.length>0){
            formList.forEach((item,i)=>{
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || ''
                let placeholder = item.placeholder
                let width = item.width || ''
                let allfg = item.all
                if (item.type === '时间查询'){
                    const begin_time = <FormItem label={label} key="begin_time">
                        {
                            getFieldDecorator('begin_time')(
                                <RangePicker format="YYYY-MM-DD"/>
                            )
                        }
                    </FormItem>
                    formItemList.push(begin_time)
                } else if (item.type === 'timePicker'){
                    const timePicker = <FormItem label={label} key="timePicker">
                        {
                            getFieldDecorator('timePicker')(
                                <RangePicker 
                                format="YYYY-MM-DD HH:mm" 
                                showTime={{
                                  hideDisabledOptions: true,
                                  format: 'HH:mm',
                                  defaultValue: [moment("00:00", 'HH:mm'), moment('23:59', 'HH:mm')],
                                }}
                              />
                            )
                        }
                    </FormItem>
                    formItemList.push(timePicker)
                }else if(item.type === 'INPUT'){
                    const INPUT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <Input type="text" placeholder={placeholder} allowClear style={{ width: width }}/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT)
                } else if (item.type === 'SELECT') {
                    const SELECT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator(field, {
                                initialValue: initialValue
                            })(
                                <Select
                                    style={{ width: width }}
                                    placeholder={placeholder}
                                >
                                    {Utils.getOptionList(item.list,allfg)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                } else if (item.type === 'SELECTSEARCH') {
                    const SELECTSEARCH = <FormItem label={label} key={field}>
                        { 
                            getFieldDecorator(field)(
                                <Select
                                    style={{ width: width }}
                                    placeholder={placeholder}
                                    defaultActiveFirstOption={false} 
                                    optionFilterProp="children"
                                    allowClear={true}
                                    showSearch
                                >
                                    {Utils.getOptionList(item.list,true)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECTSEARCH)
                } else if (item.type === 'SEARCHINPUT') {
                    const SEARCHINPUT = <FormItem label={label} key={field}>
                        { 
                            getFieldDecorator(field)(
                                <Select
                                    style={{ width: width }}
                                    placeholder={placeholder}
                                    showSearch
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    notFoundContent={null}
                                >
                                    {Utils.getOptionList(item.list,true)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SEARCHINPUT)
                } else if (item.type === 'CHECKBOX') {
                    const CHECKBOX = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator(field, {
                                valuePropName: 'checked',
                                initialValue: initialValue //true | false
                            })(
                                <Checkbox>
                                    {label}
                                </Checkbox>
                            )
                        }
                    </FormItem>
                    formItemList.push(CHECKBOX)
                }else if(item.type === 'CASCADER'){
                    const CASCADER = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator(field)(
                                <Cascader 
                                    options={this.props.productList}
                                    loadData={this.props.loadDataSelect}
                                    style={{width:250}}
                                    changeOnSelect
                                    showSearch
                                    showSearch={(inputValue, path)=>{ return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)}}
                                    placeholder={placeholder}
                                />
                            )
                        }
                    </FormItem>;
                    formItemList.push(CASCADER)
                }else if(item.type === 'RADIOBUTTON'){
                    const RADIOBUTTON = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <Radio.Group>
                                    {Utils.getRadioList(item.list)}
                                </Radio.Group>
                            )
                        }
                    </FormItem>;
                    formItemList.push(RADIOBUTTON)
                }
            })
        }
        return formItemList
    }
    render(){
        return (
            <Form layout="inline" >
                { this.initFormList() }
                <FormItem>
                    <Button type="primary" style={{ margin: '0 20px' }} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(FilterForm);