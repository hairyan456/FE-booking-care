import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { createNewUser } from '../../../services/userService';

// nếu viết sự kiện CREATE USER bên Class cha, muốn xóa hết thông tin người dùng ở các ô input sau khi nhấn nút 'CREATE'
// => dùng Emitter (xem video #42 HoiDanIT)

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowPassword: false,
            defaultUserData: {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
            },
            userData: {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
            },
            defaultValidInputs: {
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                address: true,
            },
            validInputs: {
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                address: true,
            }
        }
    }

    componentDidMount() {
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    toggle = () => {
        this.setState({
            validInputs: this.state.defaultValidInputs, userData: this.state.defaultUserData
        });
        this.props.toggleFromParrent();
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

    handleAddNewUser = async () => {
        if (this.checkValidateInputs()) {
            let res = await createNewUser(this.state.userData);
            if (res) {
                if (res.EC === 0) {
                    toast.success(res.EM);
                    this.toggle();
                    await this.props.fetchUsers();
                }
                else if (res.EC === 1) {  // email/phone existed or password.length <3
                    toast.error(res.EM);
                    let _validInputs = _.cloneDeep(this.state.defaultValidInputs);
                    _validInputs[res.DT] = false;
                    this.setState({ validInputs: _validInputs });
                }
                else { // EC = -1 or -2
                    toast.error(res.EM);
                }
            }
        }
    }
    render() {
        return (
            <>
                <Modal isOpen={this.props.isShow} toggle={() => this.toggle()} className={'modal-user-container'}
                    size="lg"
                >
                    <ModalHeader toggle={() => this.toggle()}>Create new user</ModalHeader>
                    <ModalBody>
                        <div className='modal-user-body'>
                            <div className='input-container'>
                                <label>Email:</label>
                                <input className={this.state.validInputs.email ? 'form-control' : 'form-control is-invalid'} type='email' value={this.state.userData.email} placeholder='Enter your email'
                                    onChange={(event) => this.handleOnchangeInput(event.target.value, 'email')}
                                />
                            </div>
                            <div className='input-container custom-input-password'>
                                <label>Password:</label>
                                <input className={this.state.validInputs.password ? 'form-control' : 'form-control is-invalid'} type={this.state.isShowPassword ? 'text' : 'password'} value={this.state.userData.password}
                                    placeholder='Enter your Password' onChange={(event) => this.handleOnchangeInput(event.target.value, 'password')} />
                                <span onClick={() => this.handleShowHidePassword()}>
                                    {this.state.isShowPassword ? <i className="far fa-eye"></i>
                                        : <i className="far fa-eye-slash"></i>
                                    }
                                </span>
                            </div>
                            <div className='input-container'>
                                <label>FirstName:</label>
                                <input className={this.state.validInputs.firstName ? 'form-control' : 'form-control is-invalid'} type='text' value={this.state.userData.firstName}
                                    placeholder='Enter your first name' onChange={(event) => this.handleOnchangeInput(event.target.value, 'firstName')} />
                            </div>
                            <div className='input-container'>
                                <label>LastName:</label>
                                <input className={this.state.validInputs.lastName ? 'form-control' : 'form-control is-invalid'} type='text' value={this.state.userData.lastName}
                                    placeholder='Enter your last name' onChange={(event) => this.handleOnchangeInput(event.target.value, 'lastName')} />
                            </div>
                            <div className='input-container'>
                                <label>Phone number:</label>
                                <input className={this.state.validInputs.phoneNumber ? 'form-control' : 'form-control is-invalid'} type='text' value={this.state.userData.phoneNumber}
                                    placeholder='Enter your phone number' onChange={(event) => this.handleOnchangeInput(event.target.value, 'phoneNumber')} />
                            </div>
                            <div className='input-container max-width-input'>
                                <label>Address:</label>
                                <input className={this.state.validInputs.address ? 'form-control' : 'form-control is-invalid'} type='text' value={this.state.userData.address}
                                    placeholder='Enter your address' onChange={(event) => this.handleOnchangeInput(event.target.value, 'address')} />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.handleAddNewUser()} color="warning" className='px-3' > Add </Button>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);


