
import React from 'react';
// let ImagePicker = require('antd-mobile/lib/ImagePicker');
// require('antd-mobile/lib/ImagePicker/style');
// require('antd-mobile/lib/InputItem/style');
import { InputItem, ImagePicker, TextareaItem, Toast } from 'antd-mobile';
import request from '../components/request';

class Page extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      donorFiles: [],
      id: '',
      title: '',
      familyDesc: '',
      patientDesc: '',
      imageUrl: '',
      videoUrl: '',
      name: '',
      sex: '',
      age: '',
      disease: '',
      mobile: '',
      targetMoney: '',
      deployDepartment: '',
      currentMoney: '',
      donatorNum: '',
      projectFollowUp: ''
    };
    this.renderButton = this.renderButton.bind(this);
    this.onHelpImgChange = this.onHelpImgChange.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    let pageUrl = window.location.pathname || '';
    let requestId = (pageUrl.split('/') || []).pop() || '';
    if (!requestId.match(/^[0-9]*$/)) return;
    request.getDrftAppealById('?id=' + requestId).then((res) => {
      if (!res.errorMsg && res.data) {
        let data = res.data || {};
        data.targetMoney = (data.targetMoney && (parseInt(data.targetMoney, 10)) / 100) || 0;
        data.currentMoney = (data.currentMoney && (parseInt(data.currentMoney, 10)) / 100) || 0;
        this.setState({
          ...(data || {})
        });
      }
    }, resE => {
    });
  }

  onHelpImgChange(donorFiles, type, index) {
    this.setState({
      donorFiles,
      imageUrl: donorFiles && donorFiles[0] && donorFiles[0].url || this.state.imageUrl
    });
  }

  onSubmit(save) {
    let { id = '', title = '', familyDesc = '', patientDesc = '', imageUrl = '', videoUrl = '', name = '',
      sex = '', age = '', disease = '', mobile = '', targetMoney = '', deployDepartment = '',
      currentMoney = '', donatorNum = '' , projectFollowUp = '', status = '0'
    } = this.state || {};

    targetMoney = (targetMoney && (targetMoney + '').replace(/[^\d^\.]+/ig,"")) || 0;
    targetMoney = parseFloat(targetMoney) && (parseFloat(targetMoney).toFixed(2) * 100);

    currentMoney = (currentMoney && (currentMoney + '').replace(/[^\d^\.]+/ig,"")) || 0;
    currentMoney = parseFloat(currentMoney) && (parseFloat(currentMoney).toFixed(2) * 100);

    familyDesc = familyDesc.replace(/\n/g, '</br>');
    familyDesc = familyDesc.replace(/\r/g, '</br>');
    familyDesc = familyDesc.replace(/\r\n/g, '</br>');

    patientDesc = patientDesc.replace(/\n/g, '</br>');
    patientDesc = patientDesc.replace(/\r/g, '</br>');
    patientDesc = patientDesc.replace(/\r\n/g, '</br>');

    mobile = mobile.replace(/\n/g, '</br>');
    mobile = mobile.replace(/\r/g, '</br>');
    mobile = mobile.replace(/\r\n/g, '</br>');

    if (sex === '男' || sex === 0 || sex === '0') {
      sex = 0;
    } else if (sex === '女' || sex === 1 || sex === '1') {
      sex = 1;
    } else {
      Toast.fail('请正确填写性别~', 1.5);
      return;
    }  

    if (title && familyDesc && patientDesc && name && age && disease && mobile && targetMoney && deployDepartment) {
      if (save === 'save') {
        request.saveAppealRecordNotDeploy({
          id, title, familyDesc, patientDesc, imageUrl, videoUrl, name, sex, age, disease, mobile, targetMoney, deployDepartment,
          currentMoney, donatorNum, projectFollowUp, status
        }).then(resS => {
          if (resS.errorMsg) {
            Toast.fail(resS.errorMsg, 1.5);
          } else {
            Toast.success('保存成功~', 1.5);
          }
        });
      } else {
        request.saveAppealRecordDeploy({
          id, title, familyDesc, patientDesc, imageUrl, videoUrl, name, sex, age, disease, mobile, targetMoney, deployDepartment,
          currentMoney, donatorNum, projectFollowUp
        }).then(resS => {
          if (resS.errorMsg) {
            Toast.fail(resS.errorMsg, 1.5);
          } else {
            Toast.success('发布成功~', 1.5);
          }
        });
      }
    } else {
      Toast.fail('缺少必填项~', 1.5);
    }
  }

  onSave() {
    this.onSubmit('save');
  }

  onChangeInput(item) {
    let onChangeInput = (value) => {
      switch(item) {
        case 'title':
          this.state.title = value;
          break;
        case 'familyDesc':
          this.state.familyDesc = value;
          break;
        case 'patientDesc':
          this.state.patientDesc = value;
          break;
        case 'name':
          this.state.name = value;
          break;
        case 'sex':
          this.state.sex = value;
          break;
        case 'age':
          this.state.age = value;
          break;
        case 'disease':
          this.state.disease = value;
          break;
        case 'videoUrl':
          this.state.videoUrl = value;
          break;
        case 'mobile':
          this.state.mobile = value;
          break;
        case 'targetMoney':
          this.state.targetMoney = value.replace(/[^\d^\.]+/ig,"");
          break;
        case 'deployDepartment':
          this.state.deployDepartment = value;
          break;
        case 'currentMoney':
          this.state.currentMoney = value.replace(/[^\d^\.]+/ig,"");
          break;
        case 'donatorNum':
          this.state.donatorNum = value;
          break;
        case 'projectFollowUp': 
          this.state.projectFollowUp = value;
        default: break;
      }
      this.setState({
        ...this.state
      });
    };

    return onChangeInput;

  }

  renderButton() {
    return (
      <div style={styles.fixedButton}>
        <div style={styles.helpButton} onClick={this.onSubmit}>发布</div>
        <div style={{...styles.helpButton, marginLeft: '100px'}} onClick={this.onSave}>保存</div>
      </div>
    );
  }
  
  render() {
    let { donorFiles = [], title = '', familyDesc = '', patientDesc = '', imageUrl = '', videoUrl = '', name = '',
      sex = '', age = '', disease = '', mobile = '', targetMoney = '', deployDepartment = '',
      currentMoney = '', donatorNum = '' , projectFollowUp = ''
    } = this.state || {};
    if (sex === 0 || sex === '0') sex = '男';
    if (sex === 1 || sex === '1') sex = '女';    
    const MARGINTOP = '10px';
    const TITLEWIDTH = '100px';
    const IMAGEWIDTH = '90px';
    return (
      <div style={styles.fillInfo}>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>标题:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              value={title}
              onChange={this.onChangeInput('title')}
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP, height: 'auto'}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>家庭情况:</span>
          <div style={{...styles.boxWithBorder, height: 'auto'}} className="pickerBox">
            <TextareaItem
              clear
              placeholder="支持回车换行"
              value={familyDesc}
              rows={5}
              onChange={this.onChangeInput('familyDesc')}
            ></TextareaItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP, height: 'auto'}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>患者境况:</span>
          <div style={{...styles.boxWithBorder, height: 'auto'}} className="pickerBox">
            <TextareaItem
              clear
              placeholder="支持回车换行"
              value={patientDesc}
              rows={5}
              onChange={this.onChangeInput('patientDesc')}
            ></TextareaItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP, height: IMAGEWIDTH}}>
          <span style={{...styles.largeText, color: 'transparent'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>求助图片:</span>
          <div style={{...styles.boxWithBorder, height: IMAGEWIDTH, width: IMAGEWIDTH}} className="pickerBox">
            {imageUrl ? <img src={imageUrl} style={styles.oldImage}/> : null}
            <ImagePicker
              files={donorFiles}
              onChange={this.onHelpImgChange}
              selectable={donorFiles.length < 1}
            />
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: 'transparent'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>求助视频:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              value={videoUrl}
              onChange={this.onChangeInput('videoUrl')}
              placeholder="请正确填写url，否则链接无法访问"
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>救助人姓名:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              value={name}
              onChange={this.onChangeInput('name')}
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>救助人性别:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              placeholder="男/女"
              value={sex}
              onChange={this.onChangeInput('sex')}
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>救助人年龄:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              type="number"
              value={age}
              onChange={this.onChangeInput('age')}
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>病种:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              value={disease}
              onChange={this.onChangeInput('disease')}
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>目标金额:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              value={targetMoney}
              onChange={this.onChangeInput('targetMoney')}
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>已筹金额:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              value={currentMoney}
              onChange={this.onChangeInput('currentMoney')}
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>捐款人数:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              type="number"
              value={donatorNum}
              onChange={this.onChangeInput('donatorNum')}
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: '35px'}}>
          <span style={{...styles.largeText, color: 'transparent'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>项目状态:</span>
          <span style={{...styles.largeText, ...styles.boxNoBorder, ...styles.textOverflow}}>未发布</span>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>发布单位:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              placeholder=""
              value={deployDepartment}
              onChange={this.onChangeInput('deployDepartment')}
            ></InputItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP, height: 'auto'}}>
          <span style={{...styles.largeText, color: '#ff3322'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>联系方式:</span>
          <div style={{...styles.boxWithBorder, height: 'auto'}} className="pickerBox">
            <TextareaItem
              clear
              placeholder="支持回车换行"
              value={mobile}
              rows={2}
              onChange={this.onChangeInput('mobile')}
            ></TextareaItem>
          </div>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: 'transparent'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>发布时间:</span>
          <span style={{...styles.largeText, ...styles.boxNoBorder, ...styles.textOverflow}}>将获取点击“发布”时的时间</span>
        </div>
        <div style={{...styles.rowLine, marginTop: MARGINTOP}}>
          <span style={{...styles.largeText, color: 'transparent'}}>*</span>
          <span style={{...styles.largeText, width: TITLEWIDTH, textAlign: 'right'}}>项目跟进:</span>
          <div style={styles.boxWithBorder} className="pickerBox">
            <InputItem
              clear
              placeholder="请正确填写url，否则跟进链接无法访问"
              value={projectFollowUp}
              onChange={this.onChangeInput('projectFollowUp')}
            ></InputItem>
          </div>
        </div>
        {this.renderButton()}
        <div style={{height: '190px'}}/>
      </div>
    );
  }
}

export default Page;

const styles = {
  textOverflow: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  fillInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  rowLine: {
    flex: 1,
    height: '40px',
    display: 'flex',
    flexDirection: 'row',
    padding: '0 5px',
    alignItems: 'center'
  },
  boxWithBorder: {
    marginLeft: '5px',
    border: '1px solid #999999',
    borderRadius: '4px',
    height: '40px',
    flex: 1,
    padding: '0 5px',
    display: 'flex',
    alignItems: 'center'
  },
  boxNoBorder: {
    marginLeft: '5px',
    height: '40px',
    flex: 1,
    padding: '0 5px',
    display: 'flex',
    alignItems: 'center'
  },
  largeText: {
    lineHeight: '50px',
    fontSize: '12px',
    color: '#666666'
  },
  oldImage: {
    width: '108px',
    height: '50px',
    borderRadius: '5px',
    marginRight: '10px',
    backgroundColor: '#eee'
  },
  fixedButton: {
    position: 'fixed',
    width: '100%',
    padding: '0rem 10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  helpButton: {
    width: '200px',
    height: '60px',
    lineHeight: '60px',
    fontSize: '20px',
    color: '#fff',
    backgroundColor: '#fd6463',
    textAlign: 'center',
    borderRadius: '6px'
  }
};