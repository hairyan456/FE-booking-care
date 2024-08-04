import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ModalCreate.scss';
import { LANGUAGES } from '../../../utils/constant';
import CommonUtils from '../../../utils/CommonUtils';
import * as actions from '../../../store/actions';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox'; //thư viện để click ảnh sẽ phóng to ảnh ra
import 'react-image-lightbox/style.css';
import _ from 'lodash';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowPassword: false,
            listGenders: [], listPositions: [], listRoles: [],
            previewImgURL: '', isOpen: false,
            defaultUserData: {
                email: '', password: '', firstName: '', lastName: '',
                phoneNumber: '', address: '', gender: '', positionId: '', roleId: '', avatar: ''
            },
            userData: {
                email: '', password: '', firstName: '', lastName: '',
                phoneNumber: '', address: '', gender: '', positionId: '', roleId: '', avatar: ''
            },
            defaultValidInputs: {
                email: true, password: true, firstName: true, lastName: true,
                phoneNumber: true, address: true
            },
            validInputs: {
                email: true, password: true, firstName: true, lastName: true,
                phoneNumber: true, address: true
            },
        }
    }

    componentDidMount() {
        this.props.getGenderStart(); this.props.getPositionStart(); this.props.getRoleStart();
    }

    // hàm didUpdate luôn chạy sau mỗi lần render
    componentDidUpdate(prevProps, prevState, snapshot) {
        let { genders, positions, roles } = this.props;
        // Chạy lần 1: prevProps [] vs this.props [3] => setState cho listGenders => re-render => gọi lại hàm DidUpdate()
        // Chạy lần 2: prevProps [3] vs this.props [3] => ko chạy hàm setState => Không re-render lại giao diện
        if (prevProps.genders !== genders) {
            this.setState({
                listGenders: genders,
                userData: { ...this.state.userData, gender: genders && genders.length > 0 ? genders[0].keyMap : '' }
            })
        }

        if (prevProps.positions !== positions) {
            this.setState({
                listPositions: positions,
                userData: { ...this.state.userData, positionId: positions && positions.length > 0 ? positions[0].keyMap : '' }
            })
        }

        if (prevProps.roles !== roles) {
            this.setState({
                listRoles: roles,
                userData: { ...this.state.userData, roleId: roles && roles.length > 0 ? roles[0].keyMap : '' }
            })
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    toggle = () => {
        let { genders, positions, roles } = this.props;
        this.setState({
            validInputs: this.state.defaultValidInputs,
            userData: {
                ...this.state.defaultUserData,
                gender: genders && genders.length > 0 ? genders[0].keyMap : '',
                positionId: positions && positions.length > 0 ? positions[0].keyMap : '',
                roleId: roles && roles.length > 0 ? roles[0].keyMap : ''
            },
            previewImgURL: ''
        });
        this.props.toggleFromParrent();
    }

    // hàm chuyển ảnh -> Base64 (ở CommonUtils.js)
    // khi chọn ảnh sẽ cho xem trước ở dưới (previewImage) (truyền BLOB hay base64 đều được)
    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let objURL = URL.createObjectURL(file);  // kiểu string (BLOB)
            let base64 = await CommonUtils.getBase64(file);
            let _userData = _.cloneDeep(this.state.userData);
            _userData['avatar'] = base64;
            this.setState({
                previewImgURL: objURL, userData: { ..._userData }
            });
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return; //nếu chưa tải ảnh lên sẽ không cho xem trước!
        this.setState({ isOpen: true });
    }

    handleOnchangeInput = (value, inputName) => { //thay đổi giá trị của input với name tương ứng
        let _userData = _.cloneDeep(this.state.userData);
        _userData[inputName] = value;
        this.setState({ userData: _userData });
    }

    checkValidateInputs = () => {
        let arr = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];
        for (let i = 0; i < arr.length; i++) {
            if (!(this.state.userData[arr[i]])) {
                let _validInputs = _.cloneDeep(this.state.defaultValidInputs);
                _validInputs[arr[i]] = false;
                this.setState({ validInputs: _validInputs });
                toast.error(`Empty input at ${arr[i]} field`);
                return false;
            }
        }
        //nếu các ô input đều được nhập, set toàn bộ trạng thái là True để k hiện cảnh báo màu đỏ
        this.setState({ validInputs: this.state.defaultValidInputs });
        return true;
    }

    handleSaveUser = async () => {
        if (this.checkValidateInputs()) {
            await this.props.createNewUser(this.state.userData);
            let { EM, EC, DT } = this.props;
            if (EC === 0) {
                toast.success(EM);
                this.toggle();
                await this.props.fetchUsersRedux(this.props.currentPage, this.props.currentLimit);
            }
            else if (EC === 1) { // email/phone existed or password.length <3
                toast.error(EM);
                let _validInputs = _.cloneDeep(this.state.defaultValidInputs);
                _validInputs[DT] = false;
                this.setState({ validInputs: _validInputs });
            }
            else {// EC = -1 or -2
                toast.error(EM);
            }
        }
    }


    render() {// component luôn Render lần đầu trước khi vào DidMount() và DidUpdate()
        let { language } = this.props;
        let { listGenders, listPositions, listRoles, previewImgURL, userData } = this.state;
        return (
            <>
                <Modal isOpen={this.props.isShow} toggle={() => this.toggle()} className={'modal-user-container'}
                    size="lg" zIndex={'1000'}>
                    <ModalHeader toggle={() => this.toggle()}>Create new user</ModalHeader>
                    <ModalBody>
                        <div className='user-redux-body'>
                            <div className='row'>
                                <div className='col-3'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.email" /></label>
                                    <input className={this.state.validInputs.email ? 'form-control' : 'form-control is-invalid'} type='email' placeholder='Please type your email...'
                                        value={userData.email} onChange={(event) => this.handleOnchangeInput(event.target.value, 'email')}
                                    />
                                </div>
                                <div className='col-3 custom-input-password'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.password" /></label>
                                    <input type={this.state.isShowPassword ? 'text' : 'password'} className={this.state.validInputs.password ? 'form-control' : 'form-control is-invalid'} placeholder='Your password...'
                                        value={userData.password} onChange={(event) => this.handleOnchangeInput(event.target.value, 'password')}
                                    />
                                    <span onClick={() => this.handleShowHidePassword()}>
                                        {this.state.isShowPassword ? <i className="far fa-eye"></i>
                                            : <i className="far fa-eye-slash"></i>
                                        }
                                    </span>
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.first-name" /></label>
                                    <input className={this.state.validInputs.firstName ? 'form-control' : 'form-control is-invalid'} type='text' placeholder='Please type your first name...'
                                        value={userData.firstName} onChange={(event) => this.handleOnchangeInput(event.target.value, 'firstName')}

                                    />
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.last-name" /></label>
                                    <input className={this.state.validInputs.lastName ? 'form-control' : 'form-control is-invalid'} type='text' placeholder='Please type your last name...'
                                        value={userData.lastName} onChange={(event) => this.handleOnchangeInput(event.target.value, 'lastName')}

                                    />
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.phone-number" /></label>
                                    <input className={this.state.validInputs.phoneNumber ? 'form-control' : 'form-control is-invalid'} type='text' placeholder='Please type your phone...'
                                        value={userData.phoneNumber} onChange={(event) => this.handleOnchangeInput(event.target.value, 'phoneNumber')}

                                    />
                                </div>
                                <div className='col-9'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.address" /></label>
                                    <input className={this.state.validInputs.address ? 'form-control' : 'form-control is-invalid'} type='text' placeholder='Please type your address...'
                                        value={userData.address} onChange={(event) => this.handleOnchangeInput(event.target.value, 'address')}

                                    />
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.gender" /></label>
                                    <select value={userData.gender} onChange={(event) => this.handleOnchangeInput(event.target.value, 'gender')} className='form-control'>
                                        {listGenders && listGenders.length > 0 &&
                                            listGenders.map((item, index) => {
                                                return (
                                                    <option key={`gender-${index}`} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.position" /></label>
                                    <select value={userData.positionId} onChange={(event) => this.handleOnchangeInput(event.target.value, 'positionId')} className='form-control'>
                                        {listPositions && listPositions.length > 0 &&
                                            listPositions.map((item, index) => {
                                                return (
                                                    <option key={`pos-${index}`} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.role" /></label>
                                    <select value={userData.roleId} onChange={(event) => this.handleOnchangeInput(event.target.value, 'roleId')} className='form-control'>
                                        {listRoles && listRoles.length > 0 &&
                                            listRoles.map((item, index) => {
                                                return (
                                                    <option key={`role-${index}`} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.image" /></label>
                                    <div className='preview-img-container'>
                                        <input id='previewImage' type='file' hidden onChange={(event) => this.handleOnChangeImage(event)} />
                                        <label className='label-upload' htmlFor='previewImage'><FormattedMessage id="admin.manage-user.modal-create.upload" />  <i className='fas fa-upload'></i> </label>
                                        <div onClick={() => this.openPreviewImage()} className='preview-image'
                                            style={{ backgroundImage: `url(${this.state.previewImgURL})` }}>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {this.state.isOpen &&
                                <Lightbox
                                    mainSrc={previewImgURL}
                                    onCloseRequest={() => this.setState({ isOpen: false })}
                                    className={'custom-lightbox'}
                                />
                            }
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.handleSaveUser()} color="warning" className='px-3' > Add </Button>
                        <Button color="danger" className='px-3' onClick={() => this.toggle()}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        positions: state.admin.positions,
        roles: state.admin.roles,
        EC: state.admin.EC,
        EM: state.admin.EM,
        DT: state.admin.DT,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createUser(data)),
        fetchUsersRedux: (currentPage, currentLimit) => dispatch(actions.fetchAllUsersStart(currentPage, currentLimit)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreate);
