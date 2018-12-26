import React, { Component } from 'react';
// 路基工作区深度计算
class SonInput extends React.Component {
  render() {
    return (
      <div className="myapp">
        {this.props.name}=
        <input onChange={this.props.onChange} style={{width:'36%'}}/>{this.props.dw}
      </div>
    );
  }
}

class Canvas extends Component {
  state = {
    gamma:0,
    rho:0,
  }
  
  changeHandle1(e) {
    this.setState({
      gamma: e.target.value
    });
  }
  changeHandle2(e) {
    this.setState({
      rho: e.target.value
    });
  }

  render(){
    let dict1 = {
      name:'土的容重γ',
      dw:'KN/m^3',
      onChange:this.changeHandle1.bind(this)
    }
    let dict2 = {
      name:'后轮轴载Ρ',
      dw:'KN',
      onChange:this.changeHandle2.bind(this)
    }
    return <div className="app">
          <SonInput {...dict1}/>
          <SonInput {...dict2}/>
          <p>{`深度：${Math.round(Math.pow((this.state.rho/2)*0.5*5/this.state.gamma,1/3)*10)/10}~
          ${Math.round(Math.pow((this.state.rho/2)*0.5*10/this.state.gamma,1/3)*10)/10}m`}
          </p>
      </div>
    
  }
}

export default Canvas;