import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './Support.scss'
import HeaderHomePage from '../HeaderHomePage';
import HomeFooter from '../../Footer/HomeFooter';
import SubFooter from '../../Footer/SubFooter';
import qrCode from '../../../../assets/images/Support/qr-code.png'
import chPlay from '../../../../assets/images/Support/ch-play.png'
import appStore from '../../../../assets/images/Support/appstore.png'


class Support
    extends Component {
    render() {
        return (
            <>
                <HeaderHomePage isShowBanner={false} />
                <div className='container'>
                    <div className='description'>
                        Hãy bấm vào nút mục chat bên dưới đây để nhận được hỗ trợ tự động từ BookingCare Chatbot
                    </div>
                    <div className='social-media'>
                        <div className='download-here'>
                            <a target='_blank' href='https://bookingcare.vn/app'>Tải app BookingCare tại đây</a>
                        </div>
                        <div className='qr-code'>
                            <img src={qrCode}></img>
                        </div>
                        <div className='ch-play'>
                            <a href='https://bookingcare.vn/app' target='_blank'><img src={chPlay}></img></a>
                        </div>
                        <div className='app-store'>
                            <a href='https://bookingcare.vn/app' target='_blank'> <img src={appStore}></img></a>
                        </div>
                    </div>
                </div>
                <SubFooter /> <HomeFooter />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Support);
