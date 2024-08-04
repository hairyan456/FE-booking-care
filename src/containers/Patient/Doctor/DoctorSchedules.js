import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedules.scss';
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import moment from 'moment';   // hiển thị Date theo format tùy ý 
import localization from 'moment/locale/vi';  // mặc định moment format date dạng En, thêm dòng này để format Vi global
import { getSchedulesDoctorByDate } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [], allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: ''
        }
    }

    capitalizeFirstLetter = (input) => { //viết hoa chữ cái đầu của thứ
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    getAllDays = () => {  // set mảng 7 ngày, kể từ ngày hiện tại
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let label = '';
            if (this.props.language === LANGUAGES.VI) {
                label = (i === 0) ? `Hôm nay - ${moment(new Date()).format('DD/MM')}` :
                    this.capitalizeFirstLetter(moment(new Date()).add(i, 'days').format('dddd - DD/MM'));
            }
            else {
                label = (i === 0) ? `Today - ${moment(new Date()).locale('en').format('DD/MM')}` :
                    moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM')
            }
            allDays.push({
                label: label,
                value: moment(new Date()).add(i, 'days').startOf('day').valueOf()
            })
        }
        return allDays;
    }

    async componentDidMount() {
        // moment(new Date()).format('dddd - DD/MM')
        // moment en:', moment(new Date()).locale('en').format('ddd - DD/MM')
        let allDays = this.getAllDays()
        this.setState({
            allDays: allDays && allDays.length > 0 ? allDays : [],
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }

        if ((prevState.allDays !== this.state.allDays) || (prevProps.doctorId !== this.props.doctorId)) {
            let allDays = this.state.allDays;
            if (allDays && allDays.length > 0) {
                let res = await getSchedulesDoctorByDate(this.props.doctorId, allDays[0].value);
                this.setState({
                    allAvailableTime: res && res.DT && res.DT.length > 0 ? res.DT : []
                })
            }
        }
    }

    handleOnchangeSelect = async (event) => {
        if (this.props.doctorId && this.props.doctorId !== -1) {
            let res = await getSchedulesDoctorByDate(this.props.doctorId, event.target.value);
            if (res && res.EC === 0) {
                this.setState({
                    allAvailableTime: res.DT && res.DT.length > 0 ? res.DT : []
                })
            }
        }
    }

    // hàm khi click vào time bất kì sẽ hiện modal:
    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        });
    }

    closeModalBooking = () => {
        this.setState({
            isOpenModalBooking: false,
            dataScheduleTimeModal: ''
        });
    }
    render() {
        if (this.props.doctorId) {
            let { allDays, allAvailableTime } = this.state;
            return (
                <>
                    <div className='doctor-schedule-container'>
                        <div className='all-schedules'>
                            <select onChange={(event) => this.handleOnchangeSelect(event)}>
                                {allDays && allDays.length > 0 &&
                                    allDays.map((item, index) => {
                                        return (
                                            <option key={`date-${index}`} value={item.value}>{item.label}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='all-available-time'>
                            <div className='text-calendar'>
                                <i className='fas fa-calendar-alt'></i>
                                <span><FormattedMessage id="patient.detail-doctor.schedule" /></span>
                            </div>
                            <div className='time-content'>
                                {allAvailableTime && allAvailableTime.length > 0 ?
                                    <>
                                        <div className='time-content-schedule'>
                                            {
                                                allAvailableTime.map((item, index) => {
                                                    return (
                                                        <button onClick={() => this.handleClickScheduleTime(item)} key={`available-time-${index}`}>
                                                            {this.props.language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}
                                                        </button>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className='click-here'>
                                            <span><FormattedMessage id="patient.detail-doctor.choose" /> <i className='far fa-hand-point-up'></i> <FormattedMessage id="patient.detail-doctor.book-free" /></span>
                                        </div>
                                    </>
                                    : <span style={{ fontSize: '17px' }}><FormattedMessage id="patient.detail-doctor.no-schedule" /></span>
                                }
                            </div>
                        </div>
                    </div>

                    <BookingModal isOpen={this.state.isOpenModalBooking} closeModal={this.closeModalBooking} dataTime={this.state.dataScheduleTimeModal}
                    />
                </>

            );
        }
        else {
            return <></>
        }

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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedules);
