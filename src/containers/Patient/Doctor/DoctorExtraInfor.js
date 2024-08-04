import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss';
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import NumberFormat from 'react-number-format';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false, extraInforDoctor: ''
        }
    }

    async componentDidMount() {
        let data = await this.getExtraInforDoctorById(this.props.doctorId);
        this.setState({ extraInforDoctor: data })
    }
    getExtraInforDoctorById = async (id) => {
        if (id) {
            await this.props.getExtraInforDoctorRedux(this.props.doctorId);
            let { EM, EC, extraInforDoctor } = this.props;
            if (EC === 0)
                return extraInforDoctor;
            else
                toast.error(EM);
        }
        return {};
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.doctorId !== this.props.doctorId) {
            let data = await this.getExtraInforDoctorById(this.props.doctorId);
            this.setState({ extraInforDoctor: data })
        }
    }

    showHideDetailInfor = () => {
        this.setState({ isShowDetailInfor: !this.state.isShowDetailInfor })
    }

    render() {
        if (this.props.doctorId) {
            let { isShowDetailInfor, extraInforDoctor } = this.state;
            let { language } = this.props;
            return (
                <>
                    <div className='doctor-extra-infor-container'>
                        <div className='content-up'>
                            <div className='text-address'><FormattedMessage id="patient.extra-infor-doctor.text-address" /></div>
                            <div className='name-clinic'>
                                {extraInforDoctor && extraInforDoctor.Clinic && extraInforDoctor.Clinic.name ? extraInforDoctor.Clinic.name : ''}
                            </div>
                            <div className='detail-address'>
                                {extraInforDoctor && extraInforDoctor.Clinic && extraInforDoctor.Clinic.address ? extraInforDoctor.Clinic.address : ''}
                            </div>
                        </div>
                        <div className='content-down'>
                            {!isShowDetailInfor ?
                                <div className='show-price'>
                                    <FormattedMessage id="patient.extra-infor-doctor.price" />: {extraInforDoctor && extraInforDoctor.priceData ?
                                        (language === LANGUAGES.VI ?
                                            <NumberFormat className='currency' value={extraInforDoctor.priceData.valueVi} displayType={'text'} thousandSeparator={true} suffix={'VND'} />
                                            :
                                            <NumberFormat className='currency' value={extraInforDoctor.priceData.valueEn} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                        )
                                        : ''
                                    }
                                    <span className='more-detail' onClick={() => this.showHideDetailInfor()}><FormattedMessage id="patient.extra-infor-doctor.detail" /></span>
                                </div>
                                :
                                <>
                                    <div className='detail-info'>
                                        <div className='price'>
                                            <span style={{ fontWeight: 600 }} className='left'><FormattedMessage id="patient.extra-infor-doctor.price" /></span>
                                            <span className='right'>{extraInforDoctor && extraInforDoctor.priceData ?
                                                (language === LANGUAGES.VI ?
                                                    <NumberFormat className='currency' value={extraInforDoctor.priceData.valueVi} displayType={'text'} thousandSeparator={true} suffix={'VND'} />
                                                    :
                                                    <NumberFormat className='currency' value={extraInforDoctor.priceData.valueEn} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                                )
                                                : ''
                                            }
                                            </span>
                                        </div>
                                        <div className='note'>
                                            {extraInforDoctor && extraInforDoctor.note ? extraInforDoctor.note : ''}
                                        </div>
                                    </div>
                                    <div className='payment'><FormattedMessage id="patient.extra-infor-doctor.payment" />
                                        {extraInforDoctor && extraInforDoctor.paymentData ?
                                            (language === LANGUAGES.VI ?
                                                ' ' + extraInforDoctor.paymentData.valueVi
                                                :
                                                ' ' + extraInforDoctor.paymentData.valueEn
                                            )
                                            : ''
                                        }
                                    </div>
                                    <div className='hide-price' onClick={() => this.showHideDetailInfor()}>
                                        <span><FormattedMessage id="patient.extra-infor-doctor.hide-price" /></span>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </>

            );
        }
        else
            return <></>

    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        EM: state.admin.EM,
        EC: state.admin.EC,
        extraInforDoctor: state.admin.extraInforDoctor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getExtraInforDoctorRedux: (id) => dispatch(actions.getExtraInforDoctorStart(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
