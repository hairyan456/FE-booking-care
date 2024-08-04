import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../utils/constant';
import * as actions from '../../store/actions';
import { FormattedMessage } from 'react-intl';
import { postVerifyBookingAppointment } from '../../services/userService';
import { toast } from 'react-toastify';
import HeaderHomePage from '../HomePage/Header/HeaderHomePage';
import SubFooter from '../HomePage/Footer/SubFooter';
import HomeFooter from '../HomePage/Footer/HomeFooter';

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let res = await postVerifyBookingAppointment(urlParams.get('doctorId'), urlParams.get('token'));
            if (res) {
                if (res.EC === 0)
                    this.setState({ statusVerify: true })
            }
            else {
                console.log(res);
                toast.error(res.EM);
            }
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        let { statusVerify } = this.state;
        let { language } = this.props;
        return (
            <>
                <HeaderHomePage isShowBanner={false} />
                {statusVerify ?
                    <div style={{ color: 'red', marginTop: '60px', minHeight: '150px' }} className='title'>
                        {language === LANGUAGES.VI ? `Xác nhận lịch hẹn thành công.` : `Appointment confirmed successfully.`}
                    </div>
                    :
                    <div style={{ color: 'red', marginTop: '60px', minHeight: '150px' }} className='title'>
                        {language === LANGUAGES.VI ? `Lịch hẹn này đã được xác nhận hoặc không tồn tại!` : 'This appointment has either been confirmed or does not exist!'}
                    </div>
                }
                <SubFooter />
                <HomeFooter></HomeFooter>
            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
