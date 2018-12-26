import { Form, Select, InputNumber, Button} from 'antd';
import React from 'react'
// 重力式挡土墙计算

const FormItem = Form.Item;
const Option = Select.Option;

class Demo extends React.Component {
  state={
    varfiy_mode:[
      {key:'1',name:"简单计算",value:'0.0225'},
      {key:'2',name:"路堤式挡土墙",value:'0.030'},
      {key:'3',name:"路肩式挡土墙",value:'0.025'},
    ],
    varfiy5_5:[
      {key:'0',name:"钢、铸钢",value:'78.5'},
      {key:'1',name:"钢筋混凝土",value:'25.0'},
      {key:'2',name:"沥青混凝土或片石混凝土",value:'24.001'},
      {key:'3',name:"浆砌块石或料石",value:'24.0'},
      {key:'4',name:"浆砌片石",value:'23.0'},
      {key:'5',name:"干砌块石或片石、泥结碎(砾)石",value:'21.0'},
      {key:'7',name:"砖砌体",value:'18.0'},
    ],
    delta_name:[
      '混凝土，钢筋混凝土(1/2)',
      '片、块石砌体,墙背粗糙',
      '干砌或浆砌片、块石砌体,墙背很粗糙',
      '第二破裂面土体'],
    delta_value:[0.5,7/12,2/3,1],
    mu_name:['软塑黏土','硬塑黏土','黏砂土、半干硬的黏土','砂类土(0.4)','碎石类土(0.46)','软质岩石','硬质岩石'],
    mu_value:[0.25, 0.30, 0.35, 0.40, 0.46, 0.50, 0.65],
    soil_value:[19, 20, 18, 21, 18.5, 23, 24],
    res:[]
  }
  handle = (key) => {
    console.log(key);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          res: this.count(values)
        })
        // this;
      }
    });
  }
  count(value){
    const {cos, sin, tan, atan, pow, sqrt,PI} = Math;
    let {alpha,alpha0, gamma,gamma1,gammaQ1, phi, delta, mu1,  H1,H2,  B1,B2, ql, c, d} = value;
    phi = phi/180*PI;
    let H = alpha0===0?H1 + H2:H1 + H2 + B2/(1/alpha0+1/alpha);  //将H变为整个墙高
    let q = H1<2.0 ?20.0: H1>10 ? 10:20 - 10*(H1-2)/8;
//    console.log(`alpha ${alpha}\nalpha0 ${alpha0}\ngamma ${gamma}\ngamma1 ${gamma1}
// gammaQ1 ${gammaQ1}\nphi ${phi}\ndelta ${delta}\nmu1 ${mu1}\nH ${H}\nH1 ${H1}\nH2 ${H2}
// B1 ${B1}\nB1 ${B1}\nq ${q}\nql ${ql}\nc ${c}\nd ${d}\n`);

    let G1 = gamma1 * B1 * H1;
    let G2 = gamma1 * B2 * H2;
    let G3 = gamma1 * B2 * B2*alpha0/2;
    let G0 = G1 + G2 + G3;
console.log(`G0 ${G0}\nG1 ${G1}\nG2 ${G2}\nG3 ${G3}\n`);
    let Z1 = H2 / alpha + B2-B1 + (H1 / alpha + B1)/2 ;
    let Z2 = H2 / alpha/2 + B2/2;
    let B4 = alpha0===0?B2:(H - H1 - H2)/alpha0;
    let Z3 = (B2 + B4)/3;
    let Z0 = (Z1*G1 + Z2*G2 + Z3*G3)/G0;
console.log(`Z0 ${Z0}\nZ1 ${Z1}\nZ2 ${Z2}\nZ3 ${Z3}\n`);
    alpha = atan(-1/alpha);
    alpha0 = atan(alpha0);
    c = c?c:0;
    phi = c?atan(tan(phi) + c/(gamma*H1)):phi;
    delta = phi*this.state.delta_value[delta]; //phi的函数
    let h0 = q/gamma;
    let psi = alpha + phi + delta; 
    let A = (2*d*h0)/(H*(H + 2*h0)) - tan(alpha);
    let tan_theta = psi<PI/2? -tan(psi) + sqrt((tan(psi)+1/tan(phi))*(tan(psi) + A)):- tan(psi) - sqrt((tan(psi)+1/tan(phi))*(tan(psi) + A));
    let theta = atan(tan_theta);
    let Ka = cos(theta+phi)/sin(theta+psi)*(tan_theta+tan(alpha));
    let h1 = d/(tan_theta + tan(alpha));
    let K1 = 1 + 2*h0/H*(1- h1/H);
    let E = 1/2*gamma*pow(H,2)*Ka*K1;
    let Ex = cos(alpha+delta)*E;
    let Ey = sin(alpha+delta)*E;
    let Zy = H/3 + (h0*pow(H - 2*h1,2) - h0*pow(h1,2))/(3*pow(H,2)*K1) - (H-H1-H2);
    let Zx = B4 - (Zy + (H-H1-H2))*tan(alpha);
    console.log(` Ka ${Ka}\n K1 ${K1}\n E ${E}\n alpha ${alpha/PI*180}\n delta ${delta/PI*180}\n\n`);
    // 地基承载力计算
    let Mk = G0*(Z0 - B4/2) + ql*0.5*(1.925-B4/2) + q*0.7*(2.525 - B4/2) + Ey*(Zx -B4/2) - Ex*(Zy + (H-H1-H2)/2);
    let Nk = (G0 + (ql*0.5 + q*0.7) +Ey)*cos(alpha0) + Ex*sin(alpha0);
    let B41 = alpha0===0?B2:(H - H1 - H2)/sin(alpha0);
    let e0 = Math.abs(Mk/Nk);
    let Pmax = Nk/B41*(1 + 6*e0/B41);
    let Pmin = Nk/B41*(1 - 6*e0/B41);
    console.log(` B4 ${B4}\n ΔH ${H-H1-H2}\n B41 ${B41}\n e0 ${e0}\n\n`);
    // 滑动稳定验算1
    let stable1 = (1.1*(G0+ql*0.5) + gammaQ1*(Ey + Ex*tan(alpha0)))*this.state.mu_value[mu1] + (1.1*(G0+ql*0.5) + gammaQ1*Ey)*tan(alpha0) - gammaQ1*Ex;
    let N = G0 + Ey + ql*0.5;
    let Kc = (N+Ex*tan(alpha0))/(Ex-N*tan(alpha0))*this.state.mu_value[mu1];
    let delta_N = this.state.soil_value[mu1]/2*B4*(H-H1-H2);
    // 过踵点滑动验算
    let stable2 = (1.1*(G0+ql*0.5+delta_N) + gammaQ1*Ey)*tan(phi) + 0.67*c*B2 - gammaQ1*Ex;
    let Kc_pie = (N + delta_N)* tan(phi)/E;
    // 过趾点滑动稳定
    let stable3 = 0.8*(G0*Z0 + ql*0.5*1.925) + gammaQ1*(Ey*Zx - Ex*Zy);
    let K0 = (G0*Z0 + Ey*Zx)/Ex/Zy;
    
    // 墙身正截面验算
    let K1_pie = 1 + 2*h0/H1*(1- h1/H1);
    let E_pie = 1/2*gamma*pow(H1,2)*Ka*K1_pie;
    let Ex_pie = cos(alpha+delta)*E_pie;
    let Ey_pie = sin(alpha+delta)*E_pie;
    let Zy_pie = H1/3 + (h0*pow(H1 - 2*h1,2) - h0*pow(h1,2))/(3*pow(H1,2)*K1);
    let Zx_pie = B1 - Zy*tan(alpha);
    // 地基承载力计算
    return [{key:'墙背与竖直夹角α',name:'°',value:alpha/PI*180},
      {key:'墙底倾角α0',name:'°',value:alpha0/PI*180},
      {key:'psi->ψ',name:'°',value:psi/PI*180},
      {key:'delta->δ',name:'°',value:delta/PI*180},
      {key:'theta->θ',name:'°',value:theta/PI*180},
      {key:'墙背全截面Ex',name:'KN',value:Ex},
      {key:'墙背全截面Ey',name:'KN',value:Ey},
      {key:'距墙趾点(O1)Zx',name:'m',value:Zx},
      {key:'距墙趾点(O1)Zy',name:'m',value:Zy},
      {key:'地基应力Pmax',name:'KN',value:Pmax},
      {key:'地基应力Pmin',name:'KN',value:Pmin},
      {key:'基底形心弯矩Mk',name:'KN﹒m',value:Mk},
      {key:'基底垂直力Nk',name:'KN',value:Nk},
      {key:'基底偏心距e0',name:'m',value:e0},
      {key:'趾板底宽B41',name:'m',value:B41},
      {key:'基底平面滑动稳定验算',name:'',value:stable1},
      {key:'绕踵点滑动稳定验算',name:'',value:stable2},
      {key:'绕趾点滑动稳定验算',name:'',value:stable3},
      {key:'基底平面滑动稳定系数Kc',name:'',value:Kc},
      {key:'绕踵点滑动稳定系数Kc',name:'',value:Kc_pie},
      {key:'绕趾点滑动稳定系数K0',name:'',value:K0},
      {key:'墙身正截面Ex',name:'KN',value:Ex_pie},
      {key:'墙身正截面Ey',name:'KN',value:Ey_pie},
      {key:'距墙趾板上边缘点(O2)Zx',name:'m',value:Zx_pie},
      {key:'距墙趾板上边缘点(O2)Zy',name:'m',value:Zy_pie},
      {key:'墙身自重(不包含趾板)G1',name:'KN',value:G1},
      {key:'墙身自重G0',name:'KN',value:G0},]
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 16 },
      wrapperCol: { span: 8 },
    };
    return (
      <div className="app">
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout}
          label="参数">
          <span className="ant-form-text">输入1</span>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="墙体材料(γ1)"
        >
         {getFieldDecorator('gamma1', {
            rules: [
              { required: true, message: 'Please select ' },
            ],initialValue: '23.0'
          })(
            <Select placeholder="Please select">
              {this.state.varfiy5_5.map(item => <Option value={item.value} key={item.key}>{item.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="墙背情况(δ)"
        >
         {getFieldDecorator('delta', {
            rules: [
              { required: true, message: 'Please select ' },
            ],initialValue: '0'
          })(
            <Select placeholder="Please select">
              {this.state.delta_name.map((item,index) => <Option value={String(index)} key={item}>{item}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="地基土性质(μ)"
        >
         {getFieldDecorator('mu1', {
            rules: [
              { required: true, message: 'Please select ' },
            ],initialValue: '3'
          })(
            <Select placeholder="Please select">
              {this.state.mu_name.map((item,index) => <Option value={String(index)} key={item}>{item}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout}
          label="填土内摩擦角φ">
          {getFieldDecorator('phi', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0} max={360} 
            formatter={value => `${value}°`}
            parser={value => value.replace('°', '')}/>)}
        </FormItem>

        <FormItem {...formItemLayout}
          label="填土黏聚力c(KN/m^2)">
          {getFieldDecorator('c')(
            <InputNumber placeholder="非粘性土可不填" min={1} max={1000} />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="填土重度γ(KN/m^3)"
        >
          {getFieldDecorator('gamma',{ rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0.01} max={100} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="分项系数γQ1"
        >
          {getFieldDecorator('gammaQ1',{initialValue: 1.4, rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0.30} max={2}/>
          )}
        </FormItem>

        <FormItem {...formItemLayout}
          label="墙上栏杆标准值ql(KN)">
          {getFieldDecorator('ql', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0} max={1000} />)}
        </FormItem>

        <FormItem {...formItemLayout}
          label="超载到边缘水平距离d(m)">
          {getFieldDecorator('d', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber />)}
        </FormItem>

        <FormItem {...formItemLayout}
          label="墙背坡度">
          {getFieldDecorator('alpha', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={-10} max={10} />)}
        </FormItem>

        <FormItem {...formItemLayout}
          label="墙底坡度(tanα0)">
          {getFieldDecorator('alpha0', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={-0.2} max={0.2} />)}
        </FormItem>

        <FormItem {...formItemLayout}
          label="墙高H1(m)">
          {getFieldDecorator('H1', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0} max={12} />)}
        </FormItem>

        <FormItem {...formItemLayout}
          label="墙趾板厚度H2(m)">
          {getFieldDecorator('H2', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0} max={10} />)}
        </FormItem>

        <FormItem {...formItemLayout}
          label="墙顶宽度B1(m)">
          {getFieldDecorator('B1', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0.4} max={10} />)}
        </FormItem>

        <FormItem {...formItemLayout}
          label="墙趾板宽度B2(m)">
          {getFieldDecorator('B2', { rules: [
              { required: true, message: 'Please input ' },
            ]})(
            <InputNumber min={0.4} max={10} />)}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">计算结果</Button>
        </FormItem>
      </Form>
      <div className="myapp">{this.state.res.map(item=><span key={item.key}>
      {item.key}:{Math.round(item.value*100)/100} {item.name}<br /></span>)}</div>
      滑动验算：{this.state.res.length > 2 && [
      this.state.res[13].value>this.state.res[14].value/6?<span key="21"style={{backgroundColor: 'red'}}>基底偏心距过大</span>:
      this.state.res[15].value<0?<span key="12"style={{backgroundColor: 'red'}}>基底平面滑动验算不符合</span>:
      this.state.res[16].value<0?<span key="22"style={{backgroundColor: 'red'}}>绕踵点滑动验算不符合</span>:
      this.state.res[17].value<0?<span key="13"style={{backgroundColor: 'red'}}>绕趾点滑动验算不符合</span>:
      this.state.res[18].value<1.3?<span key="23"style={{backgroundColor: 'red'}}>基底平面滑动验算不符合</span>:
      this.state.res[19].value<1.3?<span key="24"style={{backgroundColor: 'red'}}>绕踵点滑动验算不符合</span>:
      this.state.res[20].value<1.5?<span key="34"style={{backgroundColor: 'red'}}>绕趾点滑动验算不符合</span>:
      <span key="4">符合要求</span>]}
      </div>
    );
  }
}

const WrappedDemo = Form.create()(Demo);
export default WrappedDemo;