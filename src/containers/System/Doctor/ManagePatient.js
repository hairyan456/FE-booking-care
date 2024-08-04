import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss';
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker'; //chỉ trả về ngày-tháng-năm, ko có giờ:phút:giây
import { getAllPatientsForDoctor, postSendRemedy } from '../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import ModalRemedy from './ModalRemedy';
import LoadingOverLay from 'react-loading-overlay';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            listPatients: [],
            isOpenModalRemedy: false,
            dataModal: {},
            isLoading: false
        }
    }

    async componentDidMount() {
        await this.getListPatients();
    }

    getListPatients = async () => {
        let { userInfo } = this.props;
        let formattedDate = moment(new Date(this.state.selectedDate)).startOf('day').valueOf();
        let res = await getAllPatientsForDoctor(userInfo.id, formattedDate);
        if (res) {
            if (res.EC === 0)
                this.setState({ listPatients: res.DT && res.DT.length > 0 ? res.DT : [] });
            else
                toast.error(res.EM);
        }
        else console.log(res);
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedDate !== this.state.selectedDate) {
            await this.getListPatients();
        }
    }

    handleOnchangeDatePicker = (currentDate) => {
        this.setState({ selectedDate: currentDate[0] });
    }

    closeModalBooking = () => {
        this.setState({
            isOpenModalRemedy: false,
            dataModal: {}
        });
    }

    handleConfirm = async (item) => {
        if (item && !_.isEmpty(item)) {
            let data = {
                doctorId: item.doctorId,
                patientId: item.patientId,
                email: item.patientData && item.patientData.email ? item.patientData.email : '',
                timeType: item.timeType,
                patientName: (this.props.language === LANGUAGES.VI ? `${item.patientData.lastName} ${item.patientData.firstName}` : `${item.patientData.firstName} ${item.patientData.lastName}`)
            }
            this.setState({
                isOpenModalRemedy: true,
                dataModal: data
            });
        }
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({ isLoading: true });
        let res = await postSendRemedy({
            email: dataChild.patientEmail,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });
        if (res) {
            if (res.EC === 0) {
                this.setState({ isLoading: false })
                toast.success(res.EM);
                await this.getListPatients();
            }
            else {
                toast.error(res.EM);
                this.setState({ isLoading: false })
            }
        }
        else {
            console.log(`Error sending remedy: ${res}`);
            this.setState({ isLoading: false })
        }
    }
    render() {
        return (
            <>
                <LoadingOverLay active={this.state.isLoading} spinner text='Loading...'>
                    <ModalRemedy isOpen={this.state.isOpenModalRemedy} closeModal={this.closeModalBooking}
                        dataModal={this.state.dataModal}
                        sendRemedy={this.sendRemedy} />
                    <div className='manage-patient-container'>
                        <div className='title mb-5'>Manage doctor's patients</div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.handleOnchangeDatePicker}
                                    className={'form-control'}
                                    value={this.state.selectedDate}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table id="customers">
                                    <thead>
                                        <tr>
                                            <th scope='col'>No</th>
                                            <th scope='col'>Time</th>
                                            <th scope='col'>Email</th>
                                            <th scope='col'>FullName</th>
                                            <th scope='col'>Gender</th>
                                            <th scope='col'>Address</th>
                                            <th scope='col'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.listPatients && this.state.listPatients.length > 0 ?
                                            <>
                                                {this.state.listPatients.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{index + 1}</td>
                                                            <td>{this.props.language === LANGUAGES.VI ?
                                                                item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn
                                                            }</td>
                                                            <td>{item.patientData.email}</td>
                                                            <td>{this.props.language === LANGUAGES.VI ?
                                                                `${item.patientData.lastName} ${item.patientData.firstName}` : `${item.patientData.firstName} ${item.patientData.lastName}`}
                                                            </td>
                                                            <td>
                                                                {this.props.language === LANGUAGES.VI ?
                                                                    item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                                                                }
                                                            </td>
                                                            <td>{item.patientData.address}</td>
                                                            <td>
                                                                <button onClick={() => this.handleConfirm(item)} className='btn btn-confirm'>
                                                                    {this.props.language === LANGUAGES.VI ? 'Xác nhận' : 'Confirm'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                            :
                                            <>
                                                <tr style={{ fontSize: '20px', color: 'red', fontWeight: '750' }}><td style={{ textAlign: 'center' }} colSpan={'7'}>Not found patients</td></tr>
                                            </>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </LoadingOverLay>

            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
