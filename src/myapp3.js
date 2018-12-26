import React from 'react';
import { Form, Select, InputNumber, Radio, Button, Input, Icon} from 'antd';
// 车辆标准轴次换算
let id = 0;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Demo extends React.Component {
  state ={
    lz:['单轮组','双轮组','四轮组'],
    zs:['单轴','双轴'],
    eta:['1','2','4','6','8'],
    zb:[
      {key:'0',name:'沥青底面弯拉应力'},
      {key:'1',name:'半刚性基层的底面弯拉应力'},
      {key:'2',name:'贫混凝土基层的底面弯拉应力'}],
    c1:[[6.4, 1.0, 0.38],[18.5, 1.0, 0.09]],
    mi:[4.35, 8, 12],
    eta_value:[1.0, 0.65, 0.45, 0.35, 0.25],
    Ns:[],
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let res = this.calc(values);
        let Ne = 0;
        res.forEach(element => Ne += element.Ns);
        res.push({key:'总计Ns',Ns:Ne});
        this.setState({
          Ns: res,
          Ne: Math.pow(1+values.gamma/100,values.t)*365*(Ne)/(values.gamma/100)*this.state.eta_value[values.eta],
        })
      }
    });
  }
  calc(values){
    let res = values.keys.map(Array_index => {
      let c1 = this.state.c1[values.mode>0?1:0][values.c1[Array_index]];
      let c2 = 1+(values.mode > 0? 2:1.2)*(values.c2number[Array_index]-1);
      console.log(`{c1:${c1}}。{c2:${c2}}。。。第${Array_index}个车轴\n`)
      return {key: `第${Array_index}个车轴换算轴次Ni`,
      Ns: (Math.pow(values.P[Array_index]/100,this.state.mi[values.mode])*c1*c2)*values.times[Array_index]};
    })
    return res
  }

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(++id);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  render() {
    const { getFieldDecorator,getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const formItem = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <FormItem
        {...(index === 0 ? formItem : formItemLayoutWithOutLabel)}
        label={`第个${index+1}车轴`}
        requipalegreen={false}
        key={k}
      >
        {getFieldDecorator(`P[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input",
          }],
        })(
          <InputNumber placeholder="车轴重(KN)" style={{ width: '60%', marginRight: 8 }} />
        )}<span>KN</span>

        {getFieldDecorator(`times[${k}]`)(
          <InputNumber placeholder="日通过数(辆/日)" style={{ width: '60%', marginRight: 8 }} />
        )}<span>辆/日</span><br />

        {getFieldDecorator(`c1[${k}]`,{initialValue: 1})(
            <RadioGroup>
              {this.state.lz.map( (item,index) => (<RadioButton value={index} key={index}>{item}</RadioButton>))}
            </RadioGroup>)}<br />

        {getFieldDecorator(`c2number[${k}]`,{initialValue: 1})(
           <RadioGroup>
           {this.state.zs.map( (item,index) => (<RadioButton value={index+1} key={index}>{item}</RadioButton>))}
         </RadioGroup>)}

        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.remove(k)}
          />
        ) : null}
      </FormItem>
    ));
    return (<div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="参数"
        >
          <span className="ant-form-text">输入</span>
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="设计指标"
        >
          {getFieldDecorator('mode', {
            rules: [
              { requipalegreen: true, message: 'Please select one' },
            ],initialValue: '0'
          })(
            <Select placeholder="Please select one">
              {this.state.zb.map(item=>(<Option value={item.key} key={item.key}>{item.name}</Option>))}
            </Select>
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="双向车道数目"
        >
          {getFieldDecorator('eta', {initialValue: 2
          })( <RadioGroup>
            {this.state.eta.map( (item,index) => (<RadioButton value={index} key={index}>{item}</RadioButton>))}
          </RadioGroup>)}
        </FormItem>
         
        <FormItem
          {...formItemLayout}
          label="设计年限"
        >
          {getFieldDecorator('t', { initialValue: 15 })(
            <InputNumber min={1} max={1000} 
            formatter={value => `${value}年`}
            parser={value => value.replace('年', '')}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="年增长率"
        >
          {getFieldDecorator('gamma', { initialValue: 8 })(
            <InputNumber min={1} max={1000} 
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}/>
          )}
        </FormItem>

        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加车轴参数
          </Button>
        </FormItem>
        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">计算结果</Button>
        </FormItem>
      </Form>
        <div className="myapp">
        {this.state.Ns.map(item =><span key={item.key}>{item.key}:{Math.ceil(item.Ns)}<br /></span>)}
        累计标准(100KN)换算轴次Ne:<span>{Math.ceil(this.state.Ne/10000)/100}x10^6</span><br />
        交通荷载等级:<span>{Math.ceil(this.state.Ne/10000)/100<4?'轻':
        Math.ceil(this.state.Ne/10000)/100<8?'中等':
        Math.ceil(this.state.Ne/10000)/100<19?'重':'特重/极重'}</span>
        </div>
      </div>
    );
  }
}

const WrappedDemo = Form.create()(Demo);
export default WrappedDemo;
