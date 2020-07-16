import React from 'react'

class Crumbs extends React.Component {
    constructor(props) {
        super(props); 
    }
    render(){
        return (
            <div style={{padding:"0 30px", background:"#E7E6F9",height:"63px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p style={{margin:0,fontSize:"22px",color:"#7F63F4",fontWeight:"bold"}}>{this.props.text.title}</p>
                <div style={{display:"flex",justifyContent:"start",alignItems:"center"}}>
                    {/* <p style={{fontSize:"16px",color:"#7F63F4",margin:0}}>{this.props.text.sider}</p>
                    <span style={{color:"#ABAFB3",display:"block",padding:"0 10px"}}>-</span>
                    <p style={{color:"#ABAFB3",fontSize:"16px",margin:0}}>基础数据</p> */}
                </div>
            </div>
        )
    }
}

export default Crumbs