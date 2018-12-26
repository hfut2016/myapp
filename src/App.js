import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import './index'
import Layout from './Layout';

class Clock extends React.Component {
  // 初始化函数
  constructor(props) {
      super(props);
      this.state = {date: new Date()};
  }

  // 生命周期挂载函数
  componentDidMount() {
      this.timerID = setInterval(
          () => this.tick(),
          1000
      );
  }

  tick() {
      this.setState({
          date: new Date()
      });
  }
  render() {
      return (  
        <span>Now : {this.state.date.toLocaleTimeString()}</span>  
      );
  }
}

// 组件条件渲染
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleon: true};

    // this binding is necessary to make `this` work in the callBack
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleon: !prevState.isToggleon
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleon ? 'NO' : 'OFF'}
      </button>
    );
  }
}


// 获取表单输入
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange}
            />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


// 父子组件传值
class Son extends React.Component {
  render() {
    return (
      <div>
        <p>这里是son输入框： </p>
        <input onChange={this.props.onChange} />
      </div>
    );
  }
}

class Farcher extends React.Component {
  constructor() {
    super();
    this.state = {
      son: "",
    }
  }

  changeHandle(e) {
    this.setState({
      son: e.target.value
    });
  }

  render() {
    return (
      <div>
        <Son onChange={this.changeHandle.bind(this)}/>
        <h1>这里是father: {this.state.son}</h1>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }
  render() {
    return (
      <div className="App">
        {/* <Clock /> */}
        {/* <NameForm></NameForm> */}
        {/* <Canvas></Canvas> */}
        <Layout />
      </div>
    );
  }
}


export default App;
