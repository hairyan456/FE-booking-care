import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../../store/actions";
import './Login.scss';
import { toast } from 'react-toastify';
// import { FormattedMessage } from 'react-intl';
import { loginUser } from '../../../services/userService';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            isValidUsername: true,
            isValidPassword: true
        }
    }

    //hàm thay đổi value khi nhập từ bàn phím
    handleOnchangeInput = (event, name) => {
        if (name === 'username')
            this.setState({ username: event.target.value });
        else
            this.setState({ password: event.target.value });
    }

    // hàm khi Enter ở pasword input thì Login
    handlePressEnter = (event) => {
        if (event.charCode === 13 && event.code === "Enter") {
            this.handleLogin();
        }
    }

    // hàm check valid input Username & Password:
    isValidInput = () => {
        this.setState({ isValidUsername: true, isValidPassword: true });
        if (!this.state.username) {
            this.setState({ isValidUsername: false, isValidPassword: true });
            toast.error('Missing email or phone number field!');
            return false;
        }
        if (!this.state.password) {
            this.setState({ isValidUsername: true, isValidPassword: false });
            toast.error('Missing password field!');
            return false;
        }
        return true;
    }

    handleLogin = async () => {
        if (this.isValidInput()) {
            try {
                let response = await loginUser(this.state.username, this.state.password);
                if (response.EC === 0) {
                    this.props.userLoginSuccess(response.DT);
                    toast.success(response.EM);
                }
                else {
                    toast.error(response.EM);
                }
            }
            catch (error) {
                toast.error('Something wrongs on server! Please check Log');
                console.log(error);
            }
            return;
        }
    }

    // hàm hiển thị - ẩn Password input:
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    render() {
        return (
            <>
                <div className='login-background'>
                    <div className='login-container'>
                        <div className='login-content row'>
                            <div className='col-12 text-login'>LOGIN</div>
                            <div className='col-12 form-group login-input'>
                                <label>Username:</label>
                                <input type='text' className={this.state.isValidUsername ? 'form-control' : 'form-control is-invalid'} placeholder='Enter your username'
                                    value={this.state.username} onChange={(event) => this.handleOnchangeInput(event, 'username')}
                                />
                            </div>
                            <div className='col-12 form-group login-input'>
                                <label>Password</label>
                                <div className='custom-input-password' >
                                    <input className={this.state.isValidPassword ? 'form-control' : 'form-control is-invalid'} type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Enter your password'
                                        value={this.state.password} onChange={(event) => this.handleOnchangeInput(event, 'password')}
                                        onKeyPress={(event) => this.handlePressEnter(event)}
                                    />
                                    <span onClick={() => this.handleShowHidePassword()}>
                                        {this.state.isShowPassword ? <i className="far fa-eye"></i>
                                            : <i className="far fa-eye-slash"></i>
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className='col-12'>
                                <button onClick={() => this.handleLogin()} className='btn-login'>Login</button>
                            </div>
                            <div onClick={() => { this.props.history.push('/home') }} className='col-6'>
                                <span className='return-homepage'>Return to homepage</span>
                            </div>
                            <div onClick={() => { this.props.history.push('/register') }} className='col-6'>
                                <span className='register'>Register an account</span>
                            </div>
                            <div className='col-12 text-center mt-3'>
                                <span className='text-other-login'>Or login with:</span>
                            </div>
                            <div className='col-12 social-login'>
                                <i className="fab fa-facebook-f facebook"></i>
                                <i className="fab fa-google-plus-g google"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </>
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
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
