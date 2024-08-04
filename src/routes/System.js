import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
// import UserManage from '../containers/System/CRUD_User/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctors from '../containers/System/Admin/ManageDoctors';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import { withRouter } from 'react-router-dom';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;
        return (
            <>
                {isLoggedIn && userInfo && (userInfo.roleId === 'R3') &&
                    this.props.history.push('/home')
                }
                {isLoggedIn && userInfo && (userInfo.roleId === 'R2') &&
                    this.props.history.push('/doctor/manage-schedule')
                }
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            {/* <Route path="/system/user-manage" component={UserManage} /> */}
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctors} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/manage-clinic" component={ManageClinic} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(System));
