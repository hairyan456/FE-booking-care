import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailClinic.scss';
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import HeaderHomePage from '../../HomePage/Header/HeaderHomePage';
import SubFooter from '../../HomePage/Footer/SubFooter';
import HomeFooter from '../../HomePage/Footer/HomeFooter';
import DoctorSchedules from '../Doctor/DoctorSchedules';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailClinicById } from '../../../services/userService';
import { toast } from 'react-toastify';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [], detailclinic: {}
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let res = await getDetailClinicById(this.props.match.params.id)
            if (res) {
                if (res.EC === 0) {
                    this.setState({
                        detailclinic: res.DT ? res.DT : {},
                        arrDoctorId: (res.DT && res.DT.doctorClinic && res.DT.doctorClinic.length > 0 && res.DT.doctorClinic[0].doctorId)
                            ? res.DT.doctorClinic.map(item => item.doctorId) : [],
                    });
                }
                else {
                    toast.error(res.EM);
                }

            }
            else {
                console.log(res)
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    render() {
        let { arrDoctorId, detailclinic } = this.state;
        let { language } = this.props;
        return (
            <div className='boc-ngoai' style={{ backgroundColor: '#f5f5f5' }} >
                <HeaderHomePage isShowBanner={false} />
                <div className='detail-clinic-container'>
                    <div className='description-clinic'>
                        <div className='description-title'>
                            {detailclinic && detailclinic.Markdown && detailclinic.Markdown.description ? detailclinic.Markdown.description : ''}
                        </div>
                        {detailclinic && detailclinic.Markdown && detailclinic.Markdown.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailclinic.Markdown.contentHTML }} />
                        }
                    </div>
                    {arrDoctorId && arrDoctorId.length === 0 &&
                        <div className='title' style={{ color: 'red', paddingBottom: '10px' }}>
                            <FormattedMessage id='patient.detail-specialty.no-found-doctor' />
                        </div>
                    }
                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className='each-doctor' key={`doctor-shedule-${index}`}>
                                    <div className='dt-content-left'>
                                        <div className='profile-doctor'>
                                            <ProfileDoctor isShowPrice={false} doctorId={item} isShowDescriptionDoctor={true}
                                                isShowMoreInfor={true}
                                            />
                                        </div>
                                    </div>
                                    <div className='dt-content-right'>
                                        <div className='doctor-shedule'>
                                            <DoctorSchedules doctorId={item} />
                                        </div>
                                        <div className='doctor-extra-infor'>
                                            <DoctorExtraInfor doctorId={item} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <SubFooter />
                <HomeFooter />
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
