import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';

import { path } from '../utils'

import Home from '../routes/Home';
import HomePage from './HomePage/HomePage.js';
import Login from './Authenticate/Login/login.js';
import Register from './Authenticate/Register/register.js'
import System from '../routes/System';
import Support from './HomePage/Header/Support/Support.js';
import DetailDoctor from './Patient/Doctor/DetailDoctor.js';
import Doctor from '../routes/Doctor.js';
import VerifyEmail from './Patient/VerifyEmail.js';

import { CustomToastCloseButton } from '../components/CustomToast';
import CustomScrollbars from '../components/CustomScrollbars.js';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty.js';
import DetailClinic from './Patient/Clinic/DetailClinic.js';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }} >
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.HOMEPAGE} component={HomePage} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.REGISTER} component={userIsNotAuthenticated(Register)} />
                                    <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                    <Route path='/doctor' component={userIsAuthenticated(Doctor)} />
                                    <Route path={path.SUPPORT} component={(Support)} />
                                    <Route path={path.DETAIL_DOCTOR} component={(DetailDoctor)} />
                                    <Route path={path.DETAIL_SPECIALTY} component={(DetailSpecialty)} />
                                    <Route path={path.DETAIL_CLINIC} component={(DetailClinic)} />
                                    <Route path={path.VERIFY_EMAI_BOOKING} component={(VerifyEmail)} />
                                </Switch>
                            </CustomScrollbars >
                        </div>

                        <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            newestOnTop={false} rtl={false}
                            autoClose={2000} hideProgressBar={false} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={true} draggable={false} theme="dark"
                            closeButton={<CustomToastCloseButton />}
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);