import { Form, Select, InputNumber, Button} from 'antd';
import React from 'react'
// 排水设计明渠水利计算

const FormItem = Form.Item;
const Option = Select.Option;

class Demo extends React.Component {
  state={
    varfiy5_3:[
      {key:'0',name:"不整齐土方边沟、整齐石方边沟",value:'0.0275'},
      {key:'1',name:"整齐土方边沟、草皮铺砌",value:'0.0225'},
      {key:'2',name:"不整齐石方边沟",value:'0.030'},
      {key:'3',name:"干砌块石铺砌",value:'0.025'},
      {key:'4',name:"浆砌块石铺砌粗糙混凝土铺砌",value:'0.017'},
      {key:'5',name:"整齐混凝土铺砌",value:'0.014'},
    ],
    varfiy5_5:[
      {key:'0',name:"粗砂及亚砂土",value:'0.70'},
      {key:'1',name:"亚粘土",value:'0.75'},
      {key:'2',name:"粘土",value:'0.80'},
      {key:'3',name:"草皮护面",value:'1.6'},
      {key:'4',name:"干砌片石",value:'2.0',},
      {key:'5',name:"浆砌片石及浆砌砖",value:'3.5'},
      {key:'6',name:"石灰岩、砂岩及混凝土",value:'5.0'},
    ],
    res:[]
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          res: this.mac(values)
        })
      }
    });
  }
  mac(value){
    let K = Math.pow(1+value.m*value.m,1/2);
    let A = K*2 - value.m;
    value.i = value.i/100;
    let omega = 0;
    let chi = 0;
    let R = 0;
    let b = 0;
    let h = 0;
    if(!value.b && !value.h){
      omega = value.Qp/value.V_max;
      chi = 2*Math.pow(omega*A,1/2);
      R = 1/2*Math.pow(omega/A,1/2);
      h = 2* R
      b = 2*(K - value.m)* h; 
    } else {
      b = !value.b ? (2*(K-value.m)* value.h):value.b;
      h = !value.h ? (value.b /(2*(K-value.m))):value.h;
      omega =b * h + value.m * Math.pow(h,2);
      chi = 2*Math.pow(omega*A,1/2);
      R = omega / chi;
    }
    console.log(`水力要素：\nomega ${omega}\nchi ${chi}\n R ${R}\nb ${b}\nh ${h}\n\n`)
    let y = 2.5* Math.pow(value.n,2) - 0.13 - 0.75 *( Math.pow(value.n,2)-0.1)* Math.pow(R,2);
    let C = (1/value.n)*Math.pow(R,y);
    let V_min = 0.5 * Math.pow(R,1/2);
    let V = C * Math.pow(R * value.i,1/2);
    let Q = V * omega;
    console.log(` R ${R}\nA ${A}\nh ${2*R}\n b ${b}\n\n`)
    return [{key:'水力半径R',name:'m',value:R},
      {key:'过水面积ω',name:'m^2',value:omega},
      {key:'湿周χ',name:'m',value:chi},
      {key:'流量误差',name:'%',value:Math.abs(Q - value.Qp)/ value.Qp * 100},
      {key:'实际流量Q',name:'m^3/s',value:Q},
      {key:'实际流速υ',name:'m^3/s',value:V},
      {key:'V_min',name:'m/s',value:V_min},
      {key:'V_max',name:'m/s',value:value.V_max},
      {key:'底宽b',name:'m',value:b},
      {key:'渠高h',name:'m',value:h}]
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 },
    };
    return (
      <div className="app">
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="参数"
        >
          <span className="ant-form-text">输入</span>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="沟渠表面铺砌种类"
          hasFeedback
        >
          {getFieldDecorator('n', {
            rules: [
              { required: true, message: 'Please select !' },
            ],initialValue: '0.025'
          })(
            <Select placeholder="Please select ">
              {this.state.varfiy5_3.map(item => <Option value={item.value} key={item.key}>{item.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="明渠类别"
          hasFeedback
        >
          {getFieldDecorator('V_max', {
            rules: [
              { required: true, message: 'Please select ' },
            ],initialValue: '1.6'
          })(
            <Select placeholder="Please select">
              {this.state.varfiy5_5.map(item => <Option value={item.value} key={item.key}>{item.name}</Option>)}
            </Select>
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="设计流量(m^3/s)"
        >
          {getFieldDecorator('Qp', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0.001} max={10000} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="坡率(m值)"
        >
          {getFieldDecorator('m', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0.001} max={1000} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="纵坡"
        >
          {getFieldDecorator('i', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0.001} max={1000} 
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="水渠底宽(m)"
        >
          {getFieldDecorator('b')(
            <InputNumber min={0.01} max={1000}
            placeholder="可以不输入" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="水渠高度(m)"
        >
          {getFieldDecorator('h')(
            <InputNumber min={0.01} max={1000}
            placeholder="可以不输入"/>
          )}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">计算结果</Button>
        </FormItem>
      </Form>
      <div className="myapp">{this.state.res.map(item=><span key={item.key}>
      {item.key}:{Math.round(item.value*100)/100} {item.name}<br /></span>)}</div>
      建议：{this.state.res.length > 2 && [this.state.res[3].value>10?<span key="1"style={{backgroundColor: 'red'}}>流量相差过大</span>:
      this.state.res[5].value<this.state.res[6]?<span key="2"style={{backgroundColor: 'red'}}>实际流速过小</span>:
      this.state.res[5].value>this.state.res[7]?<span key="3"style={{backgroundColor: 'red'}}>实际流速过大</span>:
      <span key="4">符合要求</span>]}
      </div>
    );
  }
}

const WrappedDemo = Form.create()(Demo);
export default WrappedDemo;