import React, { Component } from 'react'
import {Table} from 'antd'

export default class BaseTable extends Component {
    state = {}
    //处理行点击事件
    onRowClick = (record, index) => {
        let rowSelection = this.props.rowSelection;
        if(rowSelection === 'checkbox'){
            let selectedRowKeys = this.props.selectedRowKeys;
            let selectedIds = this.props.selectedIds;
            let selectedItem = this.props.selectedItem || [];
            if (selectedIds) {
                const i = selectedIds.indexOf(record.id);
                if (i == -1) {//避免重复添加
                    selectedIds.push(record.id)
                    selectedRowKeys.push(record.id);
                    selectedItem.push(record);
                }else{
                    selectedIds.splice(i,1);
                    selectedRowKeys.splice(i,1);
                    selectedItem.splice(i,1);
                }
            } else {
                selectedIds = [record.id];
                selectedRowKeys = [record.id]
                selectedItem = [record];
            }
            this.props.updateSelectedItem(selectedRowKeys,selectedItem || {},selectedIds);
        }else{
            let selectKey = [record.id];
            const selectedRowKeys = this.props.selectedRowKeys
            if (selectedRowKeys && selectedRowKeys[0] == record.id){
                return;
            }
            this.props.updateSelectedItem(selectKey,record || {});
        }
    };

    // 选择框变更
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let rowSelection = this.props.rowSelection;
        const selectedIds = [];
        if(rowSelection === 'checkbox'){
            selectedRows.forEach(item => {
                selectedIds.push(item.id);
            })
            this.setState({
                selectedRowKeys,
                selectedIds:selectedIds,
                selectedItem: selectedRows
            });
        }
        this.props.updateSelectedItem(selectedRowKeys,rowSelection === 'checkbox' ? selectedRows : selectedRows[0],selectedIds);
    };

    onSelectAll = (selected, selectedRows, changeRows) => {
        let selectedIds = [];
        let selectKey = [];
        selectedRows.forEach((item,i)=> {
            selectedIds.push(item.id);
            selectKey.push(item.id);
        });
        this.props.updateSelectedItem(selectKey,selectedRows,selectedIds);
    }

    getOptions = () => {
        const { selectedRowKeys } = this.props;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect:(record, selected, selectedRows)=>{
                console.log('...',record.id)
            },
            onSelectAll:this.onSelectAll
        };
        let row_selection = this.props.rowSelection;
        // 当属性未false或者null时，说明没有单选或者复选列
        if(row_selection===false || row_selection === null){
            row_selection = false;
        }else if(row_selection === 'checkbox'){
            //设置类型未复选框
            rowSelection.type = 'checkbox';
        }else{
            //默认未单选
            row_selection = 'radio';
        }
        return <Table 
                bordered 
                rowSelection={row_selection?rowSelection:null}
                // rowKey={(record,index) => index}
                rowKey={(record,index) => record.id || record.key || index}
                onRow={(record,index) => ({
                    onClick: ()=>{
                        if(!row_selection){
                            return;
                        }
                        this.onRowClick(record,record.id)
                    }
                  })}
                  {...this.props}  
            />
    };
    render = () => {
        return (
            <div>
                {this.getOptions()}
            </div>
        )
    }
}