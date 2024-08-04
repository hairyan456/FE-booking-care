import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HeaderHomePage.scss';
import logo from '../../../assets/images/logo.svg'
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils/constant';
import { changeLanguageApp } from '../../../store/actions/appActions';
import { Link, withRouter } from 'react-router-dom';
import * as actions from "../../../store/actions";

class HeaderHomePage extends Component {
    changeLanguage = (language) => {
        //fire Redux Actions:
        this.props.changeLanguageAppRedux(language);
    }

    scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    handleLogin = () => {
        this.props.history.push('/login');
    }

    handleLogOut = () => {
        this.props.processLogout();
        this.props.history.push('/login');
    }

    render() {
        const { isShowBanner, userInfo, language, isLoggedIn } = this.props;
        return (
            <>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <Link to='/home'><img src={logo} /></Link>
                        </div>
                        <div className='center-content'>
                            <div onClick={() => this.scrollToSection('specialty')} className='child-content'>
                                <div><b><FormattedMessage id="home-header.specialty" /></b></div>
                                <div className='sub-title'><FormattedMessage id="home-header.searchDoctor" /></div>
                            </div>
                            <div onClick={() => this.scrollToSection('facility')} className='child-content'>
                                <div><b><FormattedMessage id="home-header.health-facility" /></b></div>
                                <div className='sub-title'><FormattedMessage id="home-header.select-room" /></div>
                            </div>
                            <div onClick={() => this.scrollToSection('doctor')} className='child-content'>
                                <div><b><FormattedMessage id="home-header.doctor" /></b></div>
                                <div className='sub-title'><FormattedMessage id="home-header.select-good-doctor" /></div>
                            </div>
                            <div onClick={() => this.scrollToSection('handbook')} className='child-content'>
                                <div><b><FormattedMessage id="home-header.fee" /></b></div>
                                <div className='sub-title'><FormattedMessage id="home-header.check-health" /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <i className="fas fa-question-circle"></i>
                                <Link to='/support'><FormattedMessage id="home-header.support" /></Link>
                            </div>
                            <div className={this.props.language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span></div>
                            <div className={this.props.language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                        </div>
                        {isLoggedIn ?
                            <div className='info-and-signin'>
                                <div className='info'>
                                    <i class="fas fa-user"></i>
                                    <span>{userInfo ? `${userInfo.lastName} ${userInfo.firstName}` : ``}</span>
                                </div>
                                <div onClick={() => this.handleLogOut()} className='signin'>
                                    <i class="fas fa-sign-out-alt"></i>
                                </div>
                            </div>
                            :
                            <div onClick={() => this.handleLogin()} className='btn-login'>
                                <button className='btn'>{language === LANGUAGES.VI ? 'Đăng nhập' : "Login"}</button>
                            </div>
                        }

                    </div>
                </div >

                {isShowBanner &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="banner.title1" /></div>
                            <div className='title2'><FormattedMessage id="banner.title2" /></div>
                            <div className='search'>
                                <i className='fas fa-search'></i>
                                <input type='text' placeholder='Tìm chuyên khoa khám bệnh' />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='far fa-hospital'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.text-child1" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-mobile-alt'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.text-child2" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-procedures'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.text-child3" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-flask'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.text-child4" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-user-md'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.text-child5" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-briefcase-medical'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.text-child6" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderHomePage));
