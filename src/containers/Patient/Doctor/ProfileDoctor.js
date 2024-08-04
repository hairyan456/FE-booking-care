import React, { Component } from 'react';
import { connect } from "react-redux";
import './ProfileDoctor.scss';
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { withRouter } from 'react-router-dom';

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}, isShowPrice: false, isShowMoreInfor: false
        }
    }

    async componentDidMount() {
        let data = await this.getProfileDoctorById(this.props.doctorId);
        let imageBase64 = (data && data.image) ? new Buffer(data.image, 'base64').toString('binary') : ''
        this.setState({
            dataProfile: { ...data, image: imageBase64 },
            isShowPrice: this.props.isShowPrice,
            isShowMoreInfor: this.props.isShowMoreInfor
        })
    }

    getProfileDoctorById = async (id) => {
        if (id) {
            await this.props.getProfileDoctorRedux(this.props.doctorId);
            let { EM, EC, profileDoctor } = this.props;
            if (EC === 0)
                return profileDoctor;
            else
                toast.error(EM);
        }
        return {};
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.doctorId !== this.props.doctorId) {
            let data = await this.getProfileDoctorById(this.props.doctorId);
            let imageBase64 = (data && data.image) ? new Buffer(data.image, 'base64').toString('binary') : ''
            this.setState({
                dataProfile: { ...data, image: imageBase64 }
            })
        }
    }

    renderDoctorDescription = (dataProfile) => {
        if (dataProfile && dataProfile.Markdown && dataProfile.Markdown.description) {
            return (
                <span>
                    {dataProfile.Markdown.description}
                </span>
            )
        }
    }

    capitalizeFirstLetter = (input) => { //viết hoa chữ cái đầu của thứ
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    renderTimeBooking = (dataTime, dataProfile, language) => {
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = language === LANGUAGES.VI ?
                this.capitalizeFirstLetter(moment(new Date(dataTime.date).getTime()).format('dddd - DD/MM/yyyy'))
                : this.capitalizeFirstLetter(moment(new Date(dataTime.date)).locale('en').format('ddd - yyyy/MM/DD'));
            let note = dataProfile && dataProfile.Doctor_Infor && dataProfile.Doctor_Infor.note ? dataProfile.Doctor_Infor.note : '';
            return (
                <>
                    <div>{time} - {date} </div>
                    <div>{note}</div>
                </>
            )
        }
        return <></>
    }

    renderPriceCurrency = (dataProfile, language) => {
        return (
            language === LANGUAGES.VI ?
                <NumberFormat className='currency' value={dataProfile.Doctor_Infor.priceData.valueVi} displayType={'text'}
                    thousandSeparator={true} suffix={'VND'} />
                :
                <NumberFormat className='currency' value={dataProfile.Doctor_Infor.priceData.valueEn} displayType={'text'}
                    thousandSeparator={true} prefix={'$'} />
        )
    }

    renderLocation = (dataProfile) => {
        if (dataProfile && dataProfile.Doctor_Infor && dataProfile && dataProfile.Doctor_Infor.provinceData) {
            return (this.props.language === LANGUAGES.VI) ? dataProfile.Doctor_Infor.provinceData.valueVi
                : dataProfile.Doctor_Infor.provinceData.valueEn
        }
        return '';
    }
    handleViewDetailDoctor = (id) => {
        this.props.history.push(`/detail-doctor/${id ? id : -1}`);
    }

    render() {
        let { dataProfile } = this.state,
            { language, isShowDescriptionDoctor, dataTime } = this.props;
        let nameVi = '', nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <>
                <div className='profile-doctor-container'>
                    <div className='intro-doctor'>
                        <div className='content-left' style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                        />
                        <div className='content-right'>
                            <div className='up'>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                            <div className='down'>
                                {isShowDescriptionDoctor ?
                                    <>{this.renderDoctorDescription(dataProfile)}</>
                                    :
                                    <>{this.renderTimeBooking(dataTime, dataProfile, language)}</>
                                }
                            </div>
                            <div className='location'>
                                <i className='fas fa-map-marker-alt'></i>
                                <span style={{ marginLeft: '6px' }}>
                                    {this.renderLocation(dataProfile)}
                                </span>
                            </div>
                        </div>
                    </div>
                    {this.state.isShowPrice ?
                        <div className='price'><FormattedMessage id="patient.booking-modal.price" /> &nbsp;
                            {dataProfile && dataProfile.Doctor_Infor && dataProfile.Doctor_Infor.priceData ?
                                <>{this.renderPriceCurrency(dataProfile, language)}</>
                                :
                                <></>
                            }
                        </div>
                        : <></>
                    }
                    {
                        this.state.isShowMoreInfor ?
                            <div className='more-detail-doctor'>
                                <span style={{ fontWeight: '550' }} onClick={() => this.handleViewDetailDoctor(this.props.doctorId)} >
                                    <FormattedMessage id='patient.detail-specialty.more-detail-doctor'></FormattedMessage>
                                </span>
                            </div>
                            : <></>
                    }
                </div>
            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        EM: state.admin.EM,
        EC: state.admin.EC,
        profileDoctor: state.admin.profileDoctor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getProfileDoctorRedux: (id) => dispatch(actions.getProfileDoctorStart(id)),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor));
