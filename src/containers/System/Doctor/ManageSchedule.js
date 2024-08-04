import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils/constant';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from '../../../components/Input/DatePicker'; //chỉ trả về ngày-tháng-năm, ko có giờ:phút:giây
import _ from 'lodash';
import moment from 'moment'

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDoctor: '', listDoctors: [], rangeTime: [],
            selectedDate: new Date(),
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        this.props.fetchTimeRedux();
    }

    // build array data [{label:'', value:''}] cho <Select/>
    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                result.push({
                    label: this.props.language === LANGUAGES.VI ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`,
                    value: item.id
                })
            })
        }
        return result;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            this.setState({
                listDoctors: this.buildDataInputSelect(this.props.allDoctors)
            })
        }

        if (prevProps.language !== this.props.language) {
            this.setState({
                listDoctors: this.buildDataInputSelect(this.props.allDoctors)
            })
        }

        if (prevProps.timeSchedules !== this.props.timeSchedules) {
            let data = this.props.timeSchedules;
            if (data && data.length > 0) {
                data = data.map((item, index) => ({ ...item, isActive: false })) // thêm isActive cho mỗi item
            }
            this.setState({ rangeTime: data })
        }
    }

    handleChangeSelectedDoctor = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption })
    }

    handleOnchangeDatePicker = (currentDate) => {
        this.setState({ selectedDate: currentDate[0] });
    }

    // hàm chọn các khoảng thời gian khám bệnh
    handleClickToSelectTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => (item.id === time.id ? { ...item, isActive: !item.isActive } : item));
        }
        this.setState({ rangeTime: rangeTime })
    }

    // các func "Save data Schedules":
    buildDataToPersist = () => {
        let result = [], { selectedDoctor, rangeTime, selectedDate } = this.state;
        // lọc mảng gồm các time được chọn:
        let selectedTimeArr = [];
        if (rangeTime && rangeTime.length > 0) {
            selectedTimeArr = rangeTime.filter(item => item.isActive);
        }
        // build array object:
        if (selectedTimeArr && selectedTimeArr.length > 0) {
            selectedTimeArr.map((item, index) => {
                result.push({
                    doctorId: selectedDoctor && selectedDoctor.value ? selectedDoctor.value : '',
                    date: moment(new Date(selectedDate)).startOf('day').valueOf(), //lấy thời gian đầu ngày 
                    timeType: item.keyMap
                })
            })
        }
        return result;
    }

    checkValidateInputs = () => {
        let { selectedDoctor, selectedDate, rangeTime } = this.state;
        if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
            toast.error(`Empty input at 'selected Doctor' field`);
            return false;
        }
        if (!selectedDate) {
            toast.error(`Empty input at 'selected Date' field`);
            return false;
        }
        if (JSON.stringify(selectedDate) === 'null') { // nếu cố tình chọn ngày hôm qua, selectedDate = Invalid date (null)
            toast.error(`Cannot choose yesterday!`);
            return false;
        }
        if (rangeTime && rangeTime.length > 0) {
            let obj = rangeTime.find(item => item.isActive)
            if (!obj) {
                toast.error(`No time schedule selected!`);
                return false;
            }
        }
        return true;
    }

    resetState = () => {
        let _rangeTime = _.cloneDeep(this.state.rangeTime);
        if (_rangeTime && _rangeTime.length > 0) {
            _rangeTime = _rangeTime.map(item => ({ ...item, isActive: false }));
        }
        this.setState({
            selectedDoctor: '', selectedDate: new Date(), rangeTime: _rangeTime
        })
    }

    handleSave = async () => {
        if (this.checkValidateInputs()) {
            await this.props.saveBulkScheduleDoctorRedux(this.buildDataToPersist());
            let { EM, EC } = this.props;
            if (EC === 0) {
                toast.success(EM);
                this.resetState();
            }
            else if (EC === 1) {
                toast.warning(EM);
                this.resetState();
            }
            else {
                toast.error(EM);
            }
        }
    }

    render() {// component luôn Render lần đầu trước khi vào DidMount() và DidUpdate()
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <>
                <div className='manage-schedule-container'>
                    <div className='manage-schedule-title'>
                        <FormattedMessage id="admin.manage-schedule.title" />
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-6 '>
                                <label><FormattedMessage id="admin.manage-schedule.choose-doctor" /></label>
                                <Select value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelectedDoctor}
                                    options={this.state.listDoctors}
                                    placeholder={"Select doctor bellow..."}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="admin.manage-schedule.choose-date" /></label>
                                <DatePicker
                                    onChange={this.handleOnchangeDatePicker}
                                    className={'form-control'}
                                    value={this.state.selectedDate}
                                    minDate={yesterday}
                                />
                            </div>
                            <div className='col-12 pick-hour-container'>
                                {rangeTime && rangeTime.length > 0 &&
                                    rangeTime.map((item, index) => {
                                        return (
                                            <button onClick={() => this.handleClickToSelectTime(item)} key={index}
                                                className={item.isActive ? 'btn btn-schedule active' : 'btn btn-schedule'}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                            <div className='col-12'>
                                <button onClick={() => this.handleSave()} className='btn btn-primary btn-save-schedule'><FormattedMessage id="admin.manage-schedule.button-save" /></button>
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
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        timeSchedules: state.admin.time,
        EM: state.admin.EM,
        EC: state.admin.EC,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctorsStart()),
        fetchTimeRedux: () => dispatch(actions.fetchTimeStart()),
        saveBulkScheduleDoctorRedux: (inputData) => dispatch(actions.saveBulkScheduleDoctorStart(inputData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
