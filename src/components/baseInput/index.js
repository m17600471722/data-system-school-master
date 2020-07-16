import React, { Component } from 'react'
import { Input, Select, Form, Checkbox, Cascader, DatePicker} from 'antd'
import Utils from '../../assets/js/utils'
import axios from '../../assets/js/axios'
import api from '../../config/apiConfig'
import './index.less'
const { RangePicker } = DatePicker;
const FormItem = Form.Item
const { Option } = Select

class FilterForm extends Component{
    state = {
        options:[],
    } 
    params= {
        status:false,
        cityState:false
    }
    UNSAFE_componentWillMount (){
        if(this.props.type && (this.props.type.type === 'edit' || this.props.type.type === 'look') ){
            this.getProvinces()
        }
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
    cityInitialValue = (val)=>{
        if(val && val.length === 2){
            let cityList = this.state.options
            let obj =cityList.find(item =>{
                if(item.value == val[0]){
                    return item
                }
            })
            if(!this.params.status){
                this.loadData([obj],'cityval')
            }
            return val
        }
    }
    loadData = (selectedOptions,citystate) => {
        if(selectedOptions[0] && selectedOptions.length > 0){
            const targetOption = selectedOptions[selectedOptions.length - 1]
                if(!citystate){
                    targetOption.loading = true
                }
                axios.ajax({
                    url:api.getCities,
                    method:"post",
                    data:{
                      provinceId:targetOption.value
                    }
                  }).then((res)=>{
                      let arr =[]
                      res.data.forEach(item => {
                        let obj ={
                            label:item.cityName,
                            value:item.cityId
                        }
                      arr.push(obj)
                    })
                    this.params.status = true
                    if(!citystate){
                        targetOption.loading = false
                    }
                    targetOption.children = arr
                    this.setState({
                        options: [...this.state.options],
                    })
                })
        }
       
    }
    handleChangeSearch =(val) => {
      this.props.searchCompanys(val)
    }
    onPopupVisibleChange= (value)=>{
        if(!this.params.cityState && !(this.props.type && this.props.type.type === 'edit')){
            this.params.cityState= true
            this.getProvinces()
        }
    }
    initFormList = ()=>{
    //网址输入
        const selectBefore = (
            <Select defaultValue="Http://" style={{ width: 90 }}>
                <Option value="Http://">Http://</Option>
                <Option value="Https://">Https://</Option>
            </Select>
        )
        const selectAfter = (
            <Select defaultValue=".com" style={{ width: 80 }}>
                <Option value=".com">.com</Option>
                <Option value=".cn">.cn</Option>
            </Select>
        )
        const rowObject = {
            minRows: 4, maxRows: 6
        }
        const { getFieldDecorator } = this.props.form
        const formList = this.props.formList
        const formItemList = []
        if (formList && formList.length>0){
            formList.forEach((item,i)=>{
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || null
                let placeholder = item.placeholder
                let width = item.width || ''
                let rules = item.rules || ''
                let mold = item.mold || 'text'
                let disabled=item.disabled
                let content = item.content
                let allowClears=typeof(item.allowClears) === 'undefined' ? true : item.allowClears
                let maxLength= item.maxLength || 60
                if (item.type === '时间查询'){
                    const begin_time = <FormItem label={label} key="begin_time">
                        {
                            content && (this.props.type && this.props.type.type) === 'look'? content :
                            getFieldDecorator('begin_time')(
                                <RangePicker format="YYYY-MM-DD"/>
                            )
                        }
                    </FormItem>
                    formItemList.push(begin_time)
                } else if(item.type === 'INPUT'){
                    const INPUT = <FormItem label={label} key={field} className="distance">
                        {
                            content && (this.props.type &&this.props.type.type === 'look') ? content :
                            getFieldDecorator(field,{
                                initialValue: initialValue,
                                rules:rules
                            })(
                                <Input type={mold} placeholder={placeholder} allowClear={allowClears} maxLength={maxLength} disabled={disabled}/>
                            )
                        }
                    </FormItem>
                    if(!content && (this.props.type && this.props.type.type === 'look')){
                        return
                    } else {
                        formItemList.push(INPUT)
                    }
                }else if(item.type === 'INPUTAREA'){
                    const INPUTAREA = <FormItem label={label} key={field} className="area">
                        {
                            content && (this.props.type && this.props.type.type === 'look') ? content :
                            getFieldDecorator(field,{
                                initialValue: initialValue,
                                rules:rules
                            })(
                                <Input.TextArea autoSize={rowObject} placeholder={placeholder} maxLength={maxLength} disabled={disabled} />
                            )
                        }
                    </FormItem>;
                    if(!content && (this.props.type && this.props.type.type === 'look')){
                        return
                    } else {
                        formItemList.push(INPUTAREA)
                    }
                } else if(item.type === 'INPUTWEBSITE'){
                    const INPUT = <FormItem label={label} key={field} className="distance">
                        {
                            content && (this.props.type && this.props.type.type === 'look') ? content :
                            getFieldDecorator(field,{
                                initialValue: initialValue,
                                rules:rules
                            })(
                                <Input addonBefore={selectBefore} addonAfter={selectAfter} placeholder={placeholder} allowClear/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT)
                } else if (item.type === 'SELECT') {
                    const SELECT = <FormItem label={label} key={field} className="distance">
                        {
                            content && (this.props.type && this.props.type.type === 'look') ? content :
                            getFieldDecorator(field, {
                                initialValue: initialValue,
                                rules:rules
                            })(
                                <Select
                                    optionFilterProp="children"
                                    style={{ width: width }}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                > 
                                    {Utils.getOptionList(item.list,true)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    if(!content && (this.props.type && this.props.type.type === 'look')){
                        return
                    } else {
                        formItemList.push(SELECT)
                    }
                } else if (item.type === 'SELECTSEARCH') {
                    let select ={}
                    if(initialValue){
                        select = {
                            initialValue: initialValue,
                            rules:rules
                        }
                    } else {
                        select = {
                            initialValue: null,
                            rules:rules
                        }
                    }
                    const SELECTSEARCH = <FormItem label={label} key={field} className="distance">
                        {
                            content && (this.props.type && this.props.type.type === 'look') ? content :
                            getFieldDecorator(field, select)(
                                <Select
                                    style={{ width: width }}
                                    placeholder={placeholder}
                                    onSearch={this.handleChangeSearch}
                                    defaultActiveFirstOption={false} 
                                    notFoundContent={null} 
                                    showArrow={false}
                                    filterOption={false} 
                                    optionFilterProp="children"
                                    showSearch
                                >
                                    {Utils.getOptionList(item.list,true)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    if(!content && (this.props.type && this.props.type.type === 'look')){
                        return
                    } else {
                        formItemList.push(SELECTSEARCH)
                    }
                } else if (item.type === 'CHECKBOX') {
                    const CHECKBOX = <FormItem label={label} key={field} className="distance">
                        {
                            content && (this.props.type && this.props.type.type === 'look') ? content :
                            getFieldDecorator(field, {
                                valuePropName: 'checked',
                                initialValue: initialValue, //true | false
                                rules:rules
                            })(
                                <Checkbox>
                                    {label}
                                </Checkbox>
                            )
                        }
                    </FormItem>
                    if(!content && (this.props.type && this.props.type.type === 'look')){
                        return
                    } else {
                        formItemList.push(CHECKBOX)
                    }
                } else if(item.type === 'CASCADER'){
                    const CASCADER = <FormItem label={label} key={field} className="distance">
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue && initialValue.length === 2 ? this.cityInitialValue(initialValue) :null,
                                rules:rules
                            })(
                                <Cascader options={this.state.options} onPopupVisibleChange={this.onPopupVisibleChange} placeholder={placeholder} loadData={this.loadData} disabled={this.props.type && this.props.type.type === 'look' ? true : false}/>
                            )
                        }
                    </FormItem>;
                    if((this.props.type && this.props.type.type === 'look') && !initialValue){
                        return
                    }
                    formItemList.push(CASCADER)
                }
            })
        }
        return formItemList
    }
    render(){
        return (
            <div id="inputForm">
              { this.initFormList() }
            </div>
        );
    }
}
export default FilterForm