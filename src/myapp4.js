import { Form, Select, InputNumber, Radio, Button} from 'antd';
import React from 'react'
// 沥青路面验算

const FormItem = Form.Item;
const Option = Select.Option;
class Demo extends React.Component {
  state = {
    var_name:['柔性基层', '半刚性基层', '组合式基层'],
    var_value:[960, 600, 780],
    clac_name:['沥青层', '无机结合料稳定粒料', '无机结合料稳定细粒土', '贫混凝土'],
    clac_value:[[0.09, 0.22], [0.35, 0.11], [0.45, 0.11], [0.51, 0.07]],
    Ac_select:['高速公路、一级公路', '二级公路', '三、四级公路'],
    Ac:[1.0, 1.1, 1.2],
    As_select:['沥青混凝土', '热拌沥青碎石、乳化沥青碎石', '中、低级路面'],
    As:[1.0, 1.1, 1.2],
    res:[]
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          res: this.normFile(values)
        })
      }
    });
  }

  normFile (values) {
    const {MPa, Ne, clac, class_lu, mian, varine} = values;
    const {Ac, As, var_value, clac_value} = this.state;

    let ld = var_value[varine] * Math.pow(Ne*1000000, -0.2) * Ac[class_lu] * As[mian];
    let Ka = clac_value[clac][0]* Math.pow(Ne*1000000,clac_value[clac][1])/Ac[class_lu];
    let segma = MPa / Ka;
    console.log('Upload event:', `${ld} ${segma}`);
    return [
      {key:'容许弯沉',name:'mm',value:Math.round(ld*100)/100},
      {key:'容许弯拉应力',name:'MPa',value:Math.round(segma*100)/100},
      {key:'推荐沥青面层厚度(半刚性基层)',name:'mm',value:Ne<1?'20~40':Ne<2?'50~80':Ne<4?'80~100':Ne<8?'120':Ne<12?'150':'160~180'},
      {key:'推荐沥青面层厚度(级配碎石基层)',name:'mm',value:Ne<1?'40~60':Ne<2?'80~100':Ne<4?'100~120':Ne<8?'140~200':'~'},
    ]
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 },
    };
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="参数"
        >
          <span className="ant-form-text">输入</span>
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="公路等级"
        >
          {getFieldDecorator('class_lu', {
            rules: [
              { required: true, message: 'Please select!' },
            ],
          })(
            <Select placeholder="Please select one">
              {this.state.Ac_select.map((item,index) => <Option value={index} key={index}>{item}</Option>)}
            </Select>
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="面层类型"
        >
          {getFieldDecorator('mian', {
            rules: [
              { required: true, message: 'Please select!' },
            ],
          })(
            <Select placeholder="Please select one">
              {this.state.As_select.map((item,index) => <Option value={index} key={index}>{item}</Option>)}
          </Select>)}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="弯拉应力计算层"
        >
          {getFieldDecorator('clac', {
            rules: [
              { required: true, message: 'Please select!' },
            ],
          })(
            <Select placeholder="Please select one">
              {this.state.clac_name.map((item,index) => <Option value={index} key={index}>{item}</Option>)}
            </Select>
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="基层类型"
        >
          {getFieldDecorator('varine', {
            rules: [
              { required: true, message: 'Please select!' },
            ],
          })(
            <Select placeholder="Please select one">
              {this.state.var_name.map((item,index) => <Option value={index} key={index}>{item}</Option>)}
            </Select>
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="累计轴次Ne(x10^6)"
        >
          {getFieldDecorator('Ne', {
            rules: [
              { required: true, message: 'Please select!' },
            ]})(
            <InputNumber min={0.001} max={10000} />
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="材料抗拉强度(MPa)"
        >
          {getFieldDecorator('MPa', {
            rules: [
              { required: true, message: 'Please select!' },
            ]})(
            <InputNumber min={0.001} max={10000} />
          )}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
      <div className="myapp">{this.state.res.map(item=><span key={item.key}>
      {item.key}:{item.value} {item.name}<br /></span>)}</div>
      </div>
    );
  }
}

const WrappedDemo = Form.create()(Demo);
export default WrappedDemo;