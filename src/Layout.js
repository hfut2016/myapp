import { Layout, Menu, Icon } from 'antd';
import React, { Component } from 'react';
import Myapp1 from './myapp1';
import Myapp2 from './myapp2';
import Myapp3 from './myapp3';
import Myapp4 from './myapp4';
import Myapp5 from './myapp5';
const {  Header, Content, Footer, Sider,} = Layout;


class LayOut extends Component {
  state = {
    collapsed: true,
    active: '0',
    footer: '路基路面课程设计 ©2018 Created by lkj',
    menuList:['路基工作区深度计算',
    '排水设计明渠水利计算',
    '车辆标准轴次换算',
    '沥青路面验算',
    '重力式挡土墙计算']
  };

  toggle = (key) => {
    console.log(`menu active is ${key}`)
    this.setState({
      active: key,
    });
  }
  // onCollapse = () => {
  //   this.setState({
  //     collapsed: !this.state.collapsed,
  //   });
  // }
  render(){
    const menuList = [
      {key:'0',name:'路基计算',iconType:'shop'},
      {key:'1',name:'排水计算',iconType:'upload'},
      {key:'2',name:'车辆计算',iconType:'appstore-o'},
      {key:'3',name:'路面验算',iconType:'appstore-o'},
      {key:'4',name:'挡土计算',iconType:'bar-chart'},
    ]
    return(
    <Layout>
      <Sider 
        trigger={null}
         collapsible
         collapsed={this.state.collapsed}
        //  onCollapse={this.onCollapse}
        >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
        {menuList.map( item =>(
          <Menu.Item key={item.key}>
          <a name={item.key} onClick={()=>this.toggle(item.key)}>
            <Icon type={item.iconType} />
            <span className="nav-text" >{item.name}</span></a>
          </Menu.Item> ))}
        </Menu>
        {/* <Icon
            style={{ 'fontSize': '28px', 'marginTop': '100%'}}
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.onCollapse}
            /> */}
      </Sider>
      <Layout>
      <Header style={{ background: 'rgb(220, 223, 233)', padding: 0 }} >{this.state.menuList[this.state.active]}</Header>
          <Content style={{ margin: '0 16px' , minHeight: 380}}>
            {this.state.active === '0' && <Myapp1 />}
            {this.state.active === '1' && <Myapp2 />}
            {this.state.active === '2' && <Myapp3 />}
            {this.state.active === '3' && <Myapp4 />}
            {this.state.active === '4' && <Myapp5 />}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
          {this.state.footer}
        </Footer>
      </Layout>      
    </Layout>
    );}
  }

export default LayOut;