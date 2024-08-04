import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { updateUser } from '../../../services/userService';

class ModalUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevProps.userUpdate !== this.props.userUpdate)
            this.setState({ userData: this.props.userUpdate })
    }

    toggle = () => {
        this.setState({
            validInputs: this.state.defaultValidInputs, userData: {}
        });
        this.props.toggleFromParrent();
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
            let res = await updateUser(this.state.userData);
            if (res) {
                if (res.EC === 0) {
                    toast.success(res.EM);
                    this.toggle();
                    await this.props.fetchUsers();
                }
                else if (res.EC === 1) {
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
                    <ModalHeader toggle={() => this.toggle()}>Update a user</ModalHeader>
                    <ModalBody>
                        <div className='modal-user-body'>
                            <div className='input-container'>
                                <label>Email:</label>
                                <input readOnly={true} className={this.state.validInputs.email ? 'form-control' : 'form-control is-invalid'} type='email' value={this.state.userData.email} placeholder='Enter your email'
                                    onChange={(event) => this.handleOnchangeInput(event.target.value, 'email')}
                                />
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdate);


