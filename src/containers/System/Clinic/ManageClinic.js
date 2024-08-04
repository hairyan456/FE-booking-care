import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageClinic.scss';
import CommonUtils from '../../../utils/CommonUtils';
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import _ from 'lodash'
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox'; //thư viện để click ảnh sẽ phóng to ảnh ra

// Initialize a markdown parser
const mdParser = new MarkdownIt();

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultClinicData: {
                contentMarkDown: '', contentHTML: '', description: '', image: '', name: '', address: ''
            },
            clinicData: {
                contentMarkDown: '', contentHTML: '', description: '', image: '', name: '', address: ''
            },
            previewImgURL: '', isOpen: false,
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleOnchangeInput = (value, inputName) => { //thay đổi giá trị của input với name tương ứng
        let _clinicData = _.cloneDeep(this.state.clinicData);
        _clinicData[inputName] = value;
        this.setState({ clinicData: _clinicData });
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            clinicData: { ...this.state.clinicData, contentHTML: html, contentMarkDown: text }
        })
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let objURL = URL.createObjectURL(file);  // kiểu string (BLOB)
            let base64 = await CommonUtils.getBase64(file);
            let _clinicData = _.cloneDeep(this.state.clinicData);
            _clinicData['image'] = base64;
            this.setState({
                previewImgURL: objURL, clinicData: { ..._clinicData }
            });
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return; //nếu chưa tải ảnh lên sẽ không cho xem trước!
        this.setState({ isOpen: true });
    }

    checkValidateInputs = () => {
        let arr = ['name', 'image', 'address', 'description', 'contentMarkDown'];
        for (let i = 0; i < arr.length; i++) {
            if (!(this.state.clinicData[arr[i]])) {
                toast.error(`Empty input at ${arr[i]} field`);
                return false;
            }
        }
        //nếu các ô input đều được nhập, set toàn bộ trạng thái là True để k hiện cảnh báo màu đỏ
        return true;
    }

    handleSaveClinic = async () => {
        if (this.checkValidateInputs()) {
            await this.props.createNewClinicRedux(this.state.clinicData);
            let { EM, EC } = this.props;
            if (EC === 0) {
                this.setState({
                    clinicData: { ...this.state.defaultClinicData },
                    previewImgURL: ''
                })
                toast.success(EM);
            }
            else {
                toast.error(EM)
            }
        }
    }


    render() {
        let { clinicData } = this.state;
        return (
            <>
                <div className='manage-clinic-container'>
                    <div style={{ marginBottom: '20px' }} className='title'>Manage clinics</div>
                    <div className='add-new-clinic row'>
                        <div className='col-6 form-group'>
                            <label>Tên phòng khám</label>
                            <input className={'form-control'} type='text' placeholder='Type your clinic name...'
                                value={clinicData.name} onChange={(event) => this.handleOnchangeInput(event.target.value, 'name')} />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Ảnh phòng khám</label>
                            <div className='preview-img-container'>
                                <input id='previewImage' type='file' hidden onChange={(event) => this.handleOnChangeImage(event)} />
                                <label className='label-upload' htmlFor='previewImage'><FormattedMessage id="admin.manage-user.modal-create.upload" />  <i className='fas fa-upload'></i> </label>
                                <div onClick={() => this.openPreviewImage()} className='preview-image'
                                    style={{ backgroundImage: `url(${this.state.previewImgURL})` }}>
                                </div>
                            </div>
                        </div>
                        <div className='col-6 form-group'>
                            <label>Địa chỉ</label>
                            <input className='form-control' type='text' placeholder='Type your clinic address...'
                                value={clinicData.address} onChange={(event) => this.handleOnchangeInput(event.target.value, 'address')}
                            />
                        </div>
                        <div className='col-12 form-group'>
                            <label>Mô tả</label>
                            <textarea className='form-control' placeholder='Type your description...'
                                value={clinicData.description}
                                onChange={(event) => (this.handleOnchangeInput(event.target.value, 'description'))}
                            />
                        </div>
                        <div className='col-12 manage-clinic-editor'>
                            <MdEditor style={{ height: '360px' }} renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={clinicData.contentMarkDown}
                            />
                        </div>
                        <div className='col-12'>
                            <button onClick={() => this.handleSaveClinic()} className='btn btn-warning btn-save-clinic'>Save</button>
                        </div>
                    </div>
                    {this.state.isOpen &&
                        <Lightbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                            className={'custom-lightbox'}
                        />
                    }
                </div>
            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        EM: state.admin.EM,
        EC: state.admin.EC
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createNewClinicRedux: (inputData) => dispatch(actions.createNewClinicStart(inputData)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
