import './Register.scss';
import { Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { registerNewUser } from '../../../services/userService';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            phoneNumber: "",
            firstName: '',
            lastName: '',
            password: "",
            confirmPassword: "",
            objCheckInput: {
                isValidEmail: true,
                isValidphoneNumber: true,
                isValidFirstName: true,
                isValidLastName: true,
                isValidPassword: true,
                isValidConfirmPassword: true
            },
        };
    }

    componentDidMount() {
    }

    handleRegister = async () => {
        if (this.isValidInputs()) {
            try {
                let response = await registerNewUser({
                    email: this.state.email,
                    phoneNumber: this.state.phoneNumber,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    password: this.state.password,
                }
                );
                switch (response.EC) {
                    case 0:
                        toast.success('Create successfully');
                        setTimeout(() => {
                            this.props.history.push('/login');
                        }, 2000);
                        break;
                    case 1:
                        toast.error('Email or phoneNumber is existed!');
                        break;
                    case 2:
                        toast.error('Password must have more than 3 letters');
                        break;
                    default:
                        toast.error('An unknown error occurred');
                        break;
                }
            } catch (error) {
                toast.error('Something wrongs on server! Please check Log');
                console.log(error);
            }
            return;
        }
    }

    isValidInputs = () => {
        const { email, phoneNumber, firstName, lastName, password, confirmPassword } = this.state;
        let defaultValidInput = {
            isValidEmail: true,
            isValidphoneNumber: true,
            isValidFirstName: true,
            isValidLastName: true,
            isValidPassword: true,
            isValidConfirmPassword: true
        };

        if (!email) {
            toast.error('Email is empty!');
            this.setState({ objCheckInput: { ...defaultValidInput, isValidEmail: false } });
            return false;
        }
        let req = /\S+@\S+\.\S+/;
        if (!req.test(email)) {
            toast.error('Please type a valid email!');
            this.setState({ objCheckInput: { ...defaultValidInput, isValidEmail: false } });
            return false;
        }

        if (!phoneNumber) {
            toast.error('phoneNumber is empty!');
            this.setState({ objCheckInput: { ...defaultValidInput, isValidphoneNumber: false } });
            return false;
        }
        if (!firstName) {
            toast.error('FirstName is empty!');
            this.setState({ objCheckInput: { ...defaultValidInput, isValidFirstName: false } });
            return false;
        }
        if (!lastName) {
            toast.error('LastName is empty!');
            this.setState({ objCheckInput: { ...defaultValidInput, isValidLastName: false } });
            return false;
        }
        if (!password) {
            toast.error('Password is empty!');
            this.setState({ objCheckInput: { ...defaultValidInput, isValidPassword: false } });
            return false;
        }
        if (password !== confirmPassword) {
            toast.error('Your password is not the same!');
            this.setState({ objCheckInput: { ...defaultValidInput, isValidConfirmPassword: false } });
            return false;
        }

        return true;
    }

    render() {
        const { email, phoneNumber, firstName, lastName, password, confirmPassword, objCheckInput } = this.state;
        return (
            <div className="register-container">
                <div className="container">
                    <div className="row px-3 px-sm-0 pt-3 pt-sm-5">
                        <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                            <div className='label'>Booking Care </div>
                            <div className='detail'>"Best solution for examination appointment."</div>
                        </div>
                        <div className="content-right col-12 col-sm-5 d-flex flex-column gap-3 py-3">
                            <div className='label d-sm-none'>Smart Logi </div>
                            <div className='form-group'>
                                <label>Email:</label>
                                <input className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'} placeholder='Email address' type='email'
                                    value={email} onChange={(event) => this.setState({ email: event.target.value })} />
                            </div>
                            <div className='form-group'>
                                <label>Phone number:</label>
                                <input className={objCheckInput.isValidphoneNumber ? 'form-control' : 'form-control is-invalid'} placeholder='Phone number' type='text'
                                    value={phoneNumber} onChange={(event) => this.setState({ phoneNumber: event.target.value })} />
                            </div>
                            <div className='form-group'>
                                <label>First name</label>
                                <input className={objCheckInput.isValidFirstName ? 'form-control' : 'form-control is-invalid'} placeholder='Enter your first name...' type='text'
                                    value={firstName} onChange={(event) => this.setState({ firstName: event.target.value })} />
                            </div>
                            <div className='form-group'>
                                <label>Last name</label>
                                <input className={objCheckInput.isValidLastName ? 'form-control' : 'form-control is-invalid'} placeholder='Enter your last name...' type='text'
                                    value={lastName} onChange={(event) => this.setState({ lastName: event.target.value })} />
                            </div>
                            <div className='form-group'>
                                <label>Password:</label>
                                <input className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Password' type='password'
                                    value={password} onChange={(event) => this.setState({ password: event.target.value })} />
                            </div>
                            <div className='form-group'>
                                <label>Retype password:</label>
                                <input className={objCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Retype password' type='password'
                                    value={confirmPassword} onChange={(event) => this.setState({ confirmPassword: event.target.value })} />
                            </div>
                            <button style={{ marginBottom: '25px' }} className='btn btn-primary' onClick={this.handleRegister}>Register</button>
                            <Link className='text-center' to='/login'>Already have an account ?</Link>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
