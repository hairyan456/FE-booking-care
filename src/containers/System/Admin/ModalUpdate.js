import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ModalUpdate.scss';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { toast } from 'react-toastify';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils/constant';
import Lightbox from 'react-image-lightbox'; //thư viện để click ảnh sẽ phóng to ảnh ra
import 'react-image-lightbox/style.css';
import CommonUtils from '../../../utils/CommonUtils';

class ModalUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImgURL: '', isOpen: false,
            userData: {},
            defaultValidInputs: {
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                address: true,
            },
            validInputs: {
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                address: true,
            }
        };
    }

    componentDidMount() {
        this.props.getGenderStart(); this.props.getPositionStart(); this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevStates) {
        let { genders, positions, roles } = this.props;
        if (prevProps.genders !== genders) {
            this.setState({
                listGenders: genders,
            })
        }

        if (prevProps.positions !== positions) {
            this.setState({
                listPositions: positions,
            })
        }

        if (prevProps.roles !== roles) {
            this.setState({
                listRoles: roles,
            })
        }
        // lưu ảnh base64 vào database, trong DB sẽ hiển thị dạng BLOB. Khi muốn lấy ảnh từ DB về thì sẽ là type Buffer
        if (prevProps.userUpdate !== this.props.userUpdate) {
            let imageBase64 = '';
            if (this.props.userUpdate.image) { // image có type: Buffer
                imageBase64 = new Buffer(this.props.userUpdate.image, 'base64').toString('binary');
            }
            this.setState({
                userData: this.props.userUpdate,
                previewImgURL: imageBase64
            })
        }
    }

    toggle = () => {
        this.setState({
            validInputs: this.state.defaultValidInputs, userData: {}
        });
        this.props.toggleFromParrent();
    }

    // hàm chuyển ảnh -> Base64 (ở CommonUtils.js)
    // khi chọn ảnh sẽ cho xem trước ở dưới (previewImage) (truyền BLOB hay base64 đều được)
    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let _userData = _.cloneDeep(this.state.userData);
            _userData['avatar'] = base64;
            this.setState({
                previewImgURL: base64, userData: { ..._userData }
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
        let arr = ['email', 'firstName', 'lastName', 'phoneNumber', 'address'];
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

    handleUpdateUser = async () => {
        if (this.checkValidateInputs()) {
            await this.props.updateUserRedux(this.state.userData);
            let { EM, EC, DT } = this.props;
            if (EC === 0) {
                toast.success(EM);
                this.toggle();
                await this.props.fetchUsersRedux(this.props.currentPage, this.props.currentLimit);
            }
            else if (EC === 1) {  // EC = 1: phoneNumber is already existed
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

    render() {
        let { language } = this.props;
        let { listGenders, listPositions, listRoles, previewImgURL, userData } = this.state;
        return (
            <>
                <Modal isOpen={this.props.isShow} toggle={() => this.toggle()}
                    size="lg" zIndex={'1000'}
                >
                    <ModalHeader toggle={() => this.toggle()}>Update a user</ModalHeader>
                    <ModalBody>
                        <div className='user-redux-body'>
                            <div className='row'>
                                <div className='col-4'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.email" /></label>
                                    <input readOnly className={this.state.validInputs.email ? 'form-control' : 'form-control is-invalid'} type='email' placeholder='Please type your email...'
                                        value={userData.email} onChange={(event) => this.handleOnchangeInput(event.target.value, 'email')}
                                    />
                                </div>
                                <div className='col-4'>
                                    <label><FormattedMessage id="admin.manage-user.modal-create.first-name" /></label>
                                    <input className={this.state.validInputs.firstName ? 'form-control' : 'form-control is-invalid'} type='text' placeholder='Please type your first name...'
                                        value={userData.firstName} onChange={(event) => this.handleOnchangeInput(event.target.value, 'firstName')}

                                    />
                                </div>
                                <div className='col-4'>
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
                        <Button onClick={() => this.handleUpdateUser()} color="warning" className='px-3' > Update </Button>
                        <Button color="danger" className='px-3' onClick={() => this.toggle()}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }

}

const mapStateToProps = (state) => {
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

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsersRedux: (currentPage, currentLimit) => dispatch(actions.fetchAllUsersStart(currentPage, currentLimit)),
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        updateUserRedux: (data) => dispatch(actions.updateUserStart(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdate);


