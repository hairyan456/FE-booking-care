import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss';
import { LANGUAGES } from '../../../../utils/constant';
import * as actions from '../../../../store/actions';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import { toast } from 'react-toastify';
import DatePicker from '../../../../components/Input/DatePicker'; //chỉ trả về ngày-tháng-năm, ko có giờ:phút:giây
import { postPatientBookingAppointment } from '../../../../services/userService';
import moment from 'moment';
import localization from 'moment/locale/vi';
import LoadingOverLay from 'react-loading-overlay';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultUserData: {
                fullName: '', phoneNumber: '', email: '', address: '', reason: '',
                birthday: '', gender: '', doctorId: '', timeType: ''
            },
            userData: {
                fullName: '', phoneNumber: '', email: '', address: '', reason: '',
                birthday: '', gender: '', doctorId: '', timeType: ''
            },
            defaultValidInputs: {
                fullName: true, phoneNumber: true, email: true, address: true, reason: true,
            },
            validInputs: {
                fullName: true, phoneNumber: true, email: true, address: true, reason: true,
            },
            listGenders: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.props.getGenderStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                listGenders: this.props.genders,
            })
        }

        if (prevProps.dataTime !== this.props.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let { dataTime } = this.props;
                this.setState({
                    userData: {
                        ...prevState.userData,
                        doctorId: dataTime.doctorId,
                        timeType: dataTime.timeType,
                        gender: this.props.genders && this.props.genders.length > 0 ? this.props.genders[0].keyMap : '',
                        birthday: new Date(),
                    }
                })
            }
        }
    }

    handleOnchangeInput = (value, inputName) => { //thay đổi giá trị của input với name tương ứng
        let _userData = _.cloneDeep(this.state.userData);
        _userData[inputName] = value;
        this.setState({ userData: _userData });
    }

    checkValidateInputs = () => {
        let arr = ['fullName', 'phoneNumber', 'email', 'address', 'reason'];
        for (let i = 0; i < arr.length; i++) {
            if (!(this.state.userData[arr[i]])) {
                let _validInputs = _.cloneDeep(this.state.defaultValidInputs);
                _validInputs[arr[i]] = false;
                this.setState({ validInputs: _validInputs });
                toast.error(`Empty input at ${arr[i]} field`);
                return false;
            }
        }
        //nếu các ô input đều được nhập, set toàn bộ trạng thái là True để k hiện cảnh báo màu đỏ
        this.setState({ validInputs: this.state.defaultValidInputs });
        return true;
    }

    handleOnchangeDatePicker = (currentDate) => {
        this.setState({
            userData: { ...this.state.userData, birthday: currentDate[0] }
        });
    }

    closeModalBooking = () => {
        this.setState({
            userData: this.state.defaultUserData,
            validInputs: this.state.defaultValidInputs
        });
        this.props.closeModal();
    }

    capitalizeFirstLetter = (input) => { //viết hoa chữ cái đầu của thứ
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    buildTimeBooking = (dataTime, language) => {
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = language === LANGUAGES.VI ?
                this.capitalizeFirstLetter(moment(new Date(dataTime.date).getTime()).format('dddd - DD/MM/yyyy'))
                : this.capitalizeFirstLetter(moment(new Date(dataTime.date)).locale('en').format('ddd - yyyy/MM/DD'));
            return `${time} - ${date}`;
        }
        return '';
    }

    builDoctorName = (dataTime, language) => {
        if (dataTime && !_.isEmpty(dataTime)) {
            if (dataTime.doctorData) {
                return (language === LANGUAGES.VI) ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}` :
                    `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            }
        }
        return '';
    }

    buildClinicName = (dataTime) => {
        if (dataTime && !_.isEmpty(dataTime)) {
            if (dataTime.doctorData && dataTime.doctorData.Doctor_Infor && dataTime.doctorData.Doctor_Infor.Clinic) {
                return `${dataTime.doctorData.Doctor_Infor.Clinic.name} - ${dataTime.doctorData.Doctor_Infor.Clinic.address}`;
            }
        }
        return '';
    }

    handleConfirmModal = async () => {
        let { userData } = this.state;
        let { dataTime } = this.props;
        if (this.checkValidateInputs()) {
            this.setState({ isLoading: true });
            let data = {
                fullName: userData.fullName,
                phoneNumber: userData.phoneNumber, timeType: userData.timeType,
                address: userData.address,
                email: userData.email,
                date: dataTime && dataTime.date ? new Date(dataTime.date).getTime() : '',
                gender: userData.gender,
                doctorId: userData.doctorId,
                timeType: userData.timeType,
                timeBooking: this.buildTimeBooking(this.props.dataTime, this.props.language),
                doctorName: this.builDoctorName(this.props.dataTime, this.props.language),
                addressClinic: this.buildClinicName(this.props.dataTime),
                language: this.props.language,
            }
            let res = await postPatientBookingAppointment(data);
            if (res.EC === 0) {
                this.setState({ isLoading: false });
                toast.success(res.EM);
                this.closeModalBooking();
            }
            else if (res.EC === 1) {
                this.setState({ isLoading: false });
                toast.error(res.EM);
                let _validInputs = _.cloneDeep(this.state.defaultValidInputs);
                _validInputs[res.DT] = false;
                this.setState({ validInputs: _validInputs });
            }
            else {// EC = -1 or -2
                this.setState({ isLoading: false });
                toast.error(res.EM);
            }
        }
    }
    render() {
        let { dataTime, language } = this.props;
        let { userData, listGenders } = this.state;
        return (
            <>
                <LoadingOverLay active={this.state.isLoading} spinner text='Loading...'>
                    <Modal isOpen={this.props.isOpen} className={'booking-modal-container'} size="lg"
                        centered zIndex={'10000'} toggle={() => this.closeModalBooking()}
                    >
                        <div className='booking-modal-content'>
                            <div className='booking-modal-header'>
                                <span className='left'><FormattedMessage id="patient.booking-modal.title-modal" /></span>
                                <span className='right btn btn-danger' onClick={() => this.closeModalBooking()}><i className='fas fa-times'></i></span>
                            </div>
                            <div className='booking-modal-body'>
                                <div className='doctor-infor'>
                                    <ProfileDoctor isShowPrice={true} doctorId={dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : ''}
                                        isShowDescriptionDoctor={false} dataTime={dataTime}
                                    />
                                </div>
                                <div className='row'>
                                    <div className='col-6 form-group'>
                                        <label><FormattedMessage id="patient.booking-modal.fullName" /></label>
                                        <input className={this.state.validInputs.fullName ? 'form-control' : 'form-control is-invalid'} placeholder='Your fullname...'
                                            value={userData.fullName}
                                            onChange={(event) => this.handleOnchangeInput(event.target.value, 'fullName')}
                                        />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label><FormattedMessage id="patient.booking-modal.phoneNumber" /></label>
                                        <input className={this.state.validInputs.phoneNumber ? 'form-control' : 'form-control is-invalid'} placeholder='Your phone...'
                                            value={userData.phoneNumber}
                                            onChange={(event) => this.handleOnchangeInput(event.target.value, 'phoneNumber')}
                                        />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                        <input className={this.state.validInputs.email ? 'form-control' : 'form-control is-invalid'} placeholder='Your email...'
                                            value={userData.email}
                                            onChange={(event) => this.handleOnchangeInput(event.target.value, 'email')} />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                        <input className={this.state.validInputs.address ? 'form-control' : 'form-control is-invalid'} placeholder='Your address...'
                                            value={userData.address}
                                            onChange={(event) => this.handleOnchangeInput(event.target.value, 'address')} />
                                    </div>
                                    <div className='col-12 form-group'>
                                        <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                                        <input className={this.state.validInputs.reason ? 'form-control' : 'form-control is-invalid'} placeholder='Your reason...'
                                            value={userData.reason}
                                            onChange={(event) => this.handleOnchangeInput(event.target.value, 'reason')} />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                                        <DatePicker
                                            onChange={this.handleOnchangeDatePicker}
                                            className={'form-control'}
                                            value={this.state.userData.birthday}
                                        />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                        <select value={userData.gender} onChange={(event) => this.handleOnchangeInput(event.target.value, 'gender')} className='form-control'>
                                            {listGenders && listGenders.length > 0 &&
                                                listGenders.map((item, index) => {
                                                    return (
                                                        <option key={`gender-${index}`} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='booking-modal-footer'>
                                <button onClick={() => this.handleConfirmModal()} className='btn-booking-confirm'><FormattedMessage id="patient.booking-modal.confirm" /></button>
                                <button className='btn-booking-cancel' onClick={() => this.closeModalBooking()}><FormattedMessage id="patient.booking-modal.cancel" /></button>
                            </div>
                        </div>
                    </Modal >
                </LoadingOverLay>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
