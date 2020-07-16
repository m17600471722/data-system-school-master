import React from "react"

class Classroom extends React.Component{
    render(){
        return(
            <div style={{textAlign:"center"}}>
                <img className="development" src={require("../../../assets/img/development.png")}/>
                <p className="deveText">工程师正在加急开发中…</p>
            </div>
        )
    }
}
export default Classroom