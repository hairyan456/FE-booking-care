import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import logo1 from '../../../assets/images/About/vtv1.png';
import logo2 from '../../../assets/images/About/vnexpress.png';
import logo3 from '../../../assets/images/About/cuc-cong-nghe-thong-tin-bo-y-te-2.png';
import logo4 from '../../../assets/images/About/ictnews.png';
import logo5 from '../../../assets/images/About/165432-vtcnewslogosvg.png';
import logo6 from '../../../assets/images/About/110757-dantrilogo.png';

class About extends Component {
    render() {
        return (
            <>
                <div className='section-shared section-about'>
                    <div className='section-about-header'> <FormattedMessage id='homepage.about-title' /></div>
                    <div className='section-about-content'>
                        <div className='content-left'>
                            <iframe className='video' src="https://www.youtube.com/embed/FyDQljKtWnI"
                                title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
                                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                        </div>
                        <div className='content-right'>
                            <div className='sub-1'>
                                <div className='title-left'>
                                    <a target='_blank' href='https://vtv.vn/video/ca-phe-khoi-nghiep-14-11-2018-334894.htm'>
                                        <img src={logo1} />
                                    </a>
                                </div>
                                <div className='title-left'>
                                    <a target='_blank' href='https://video.vnexpress.net/cuoc-song-4-0/kham-benh-khong-phai-xep-hang-o-ha-noi-3797126.html'>
                                        <img src={logo2} />
                                    </a>
                                </div>
                                <div className='title-left'>
                                    <a target='_blank' href='https://infonet.vietnamnet.vn/da-co-hon-20000-luot-benh-nhan-dat-lich-kham-qua-bookingcare-175080.html'>
                                        <img src={logo3} />
                                    </a>
                                </div>
                            </div>
                            <div className='sub-2'>
                                <div className='title-right'>
                                    <a target='_blank' href='https://infonet.vietnamnet.vn/da-co-hon-20000-luot-benh-nhan-dat-lich-kham-qua-bookingcare-175080.html'>
                                        <img src={logo4} />
                                    </a>
                                </div>
                                <div className='title-right'>
                                    <a target='_blank' href='https://infonet.vietnamnet.vn/da-co-hon-20000-luot-benh-nhan-dat-lich-kham-qua-bookingcare-175080.html'>
                                        <img src={logo5} />
                                    </a>
                                </div>
                                <div className='title-right'>
                                    <a target='_blank' href='https://infonet.vietnamnet.vn/da-co-hon-20000-luot-benh-nhan-dat-lich-kham-qua-bookingcare-175080.html'>
                                        <img src={logo6} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
