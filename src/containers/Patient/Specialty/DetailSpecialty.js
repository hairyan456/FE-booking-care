import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailSpecialty.scss';
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import HeaderHomePage from '../../HomePage/Header/HeaderHomePage';
import SubFooter from '../../HomePage/Footer/SubFooter';
import HomeFooter from '../../HomePage/Footer/HomeFooter';
import DoctorSchedules from '../Doctor/DoctorSchedules';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialtyById, getAllcodes } from '../../../services/userService';
import { toast } from 'react-toastify';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [], detailSpecialty: {}, listProvinces: [],
        }
    }

    getAllProvinces = async () => {
        let resProvince = await getAllcodes('PROVINCE');
        if (resProvince) {
            if (resProvince.EC !== 0) {
                toast.error(resProvince.EM);
                return [];
            }
            else {
                if (resProvince.DT && resProvince.DT.length > 0) {
                    resProvince.DT.unshift({ keyMap: 'ALL', type: 'PROVINCE', valueEn: 'ALL', valueVi: 'Toàn quốc' });
                    return resProvince.DT;
                }
                return [];
            }
        }
        else {
            console.log(resProvince)
            return [];
        }
    }

    async componentDidMount() {
        let dataProvinces = await this.getAllProvinces();
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let res = await getDetailSpecialtyById(this.props.match.params.id, 'ALL')
            if (res) {
                if (res.EC === 0) {
                    this.setState({
                        detailSpecialty: res.DT ? res.DT : {},
                        arrDoctorId: (res.DT && res.DT.doctorSpecialty && res.DT.doctorSpecialty.length > 0)
                            ? res.DT.doctorSpecialty.map(item => item.doctorId) : [],
                        listProvinces: dataProvinces,
                    });
                }
                else
                    toast.error(res.EM);
            }
            else {
                console.log(res)
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleOnChangeProvince = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let res = await getDetailSpecialtyById(this.props.match.params.id, event.target.value);
            if (res) {
                if (res.EC === 0) {
                    this.setState({
                        arrDoctorId: (res.DT && res.DT.doctorSpecialty && res.DT.doctorSpecialty.length > 0)
                            ? res.DT.doctorSpecialty.map(item => item.doctorId) : [],
                    });
                }
                else
                    toast.error(res.EM);
            }
            else {
                console.log(res)
            }
        }
    }

    render() {
        let { arrDoctorId, detailSpecialty, listProvinces, doctorLocation } = this.state;
        let { language } = this.props;
        return (
            <div className='boc-ngoai' style={{ backgroundColor: '#f5f5f5' }} >
                <HeaderHomePage isShowBanner={false} />
                <div className='detail-specialty-container'>
                    <div className='description-specialty'>
                        <div className='description-title'>
                            {detailSpecialty && detailSpecialty.Markdown && detailSpecialty.Markdown.description ? detailSpecialty.Markdown.description : ''}
                        </div>
                        {detailSpecialty && detailSpecialty.Markdown && detailSpecialty.Markdown.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailSpecialty.Markdown.contentHTML }} />
                        }
                    </div>
                    <div className='search-doctors-specialty'>
                        <select onChange={(event) => this.handleOnChangeProvince(event)} style={{ width: '10%', marginTop: '20px', }} className='form-control'>
                            {listProvinces && listProvinces.length > 0 &&
                                listProvinces.map((item, index) => {
                                    return (
                                        <option key={`province-${index}`} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    {arrDoctorId && arrDoctorId.length === 0 &&
                        <div className='title' style={{ color: 'red', paddingBottom: '10px' }}><FormattedMessage id='patient.detail-specialty.no-found-doctor'></FormattedMessage></div>
                    }
                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className='each-doctor' key={`doctor-shedule-${index}`}>
                                    <div className='dt-content-left'>
                                        <div className='profile-doctor'>
                                            <ProfileDoctor isShowPrice={false} doctorId={item} isShowDescriptionDoctor={true}
                                                isShowMoreInfor={true} doctorLocation={doctorLocation}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
