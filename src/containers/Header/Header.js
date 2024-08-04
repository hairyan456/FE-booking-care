import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, userRoles } from '../../utils/constant';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: []
        }
    }

    changeLanguage = (language) => {
        //fire Redux Actions:
        this.props.changeLanguageAppRedux(language);
    }

    componentDidMount() {
        let { userInfo } = this.props;
        if (userInfo && !_.isEmpty(userInfo)) {
            if (userInfo.roleId === userRoles.ADMIN)
                this.setState({ menuApp: adminMenu })
            else if (userInfo.roleId === userRoles.DOCTOR)
                this.setState({ menuApp: doctorMenu })

        }
    }

    render() {
        const { processLogout, userInfo } = this.props;
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                { /*tùy chỉnh ngôn ngữ VN - EN*/}
                <div className='languages'>
                    <span className='welcome'><FormattedMessage id="home-header.welcome" />
                        {userInfo && userInfo.firstName && userInfo.lastName ? userInfo.firstName + ' ' + userInfo.lastName : ''}
                    </span>
                    <span className={this.props.language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'} onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span>
                    <span className={this.props.language === LANGUAGES.EN ? 'language-en active' : 'language-en'} onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>

                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
