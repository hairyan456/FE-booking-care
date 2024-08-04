import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import _ from 'lodash';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctors.scss'
import Select from 'react-select';
import { LANGUAGES, manageActions } from '../../../utils/constant';
import { toast } from 'react-toastify';

// Initialize a markdown parser
const mdParser = new MarkdownIt();

class ManageDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // state doctor_markdown 
            contentMarkDown: '', contentHTML: '', description: '', hasDataMarkdown: false,
            listDoctors: [], selectedDoctor: '',

            // state doctor_infor
            listPrices: [], selectedPrice: '',
            listPayments: [], selectedPayment: '',
            listProvinces: [], selectedProvince: '',
            note: '',
            listSpecialties: [], selectedSpecialty: '',
            listClinics: [], selectedClinic: '',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        this.props.fetchRequiredDoctorInforRedux();
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let obj = {};
                if (type === 'DOCTOR') {
                    obj.label = this.props.language === LANGUAGES.VI ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`;
                    obj.value = item.id;
                }
                else if (type === 'PRICE') {
                    obj.value = item.keyMap;
                    obj.label = this.props.language === LANGUAGES.VI ? `${item.valueVi} VND` : ` $${item.valueEn}`;
                }
                else if (type === 'PAYMENT' || type === 'PROVINCE') {
                    obj.value = item.keyMap;
                    obj.label = this.props.language === LANGUAGES.VI ? `${item.valueVi}` : `${item.valueEn}`;
                }
                else if (type === 'SPECIALTY') {
                    obj.value = item.id;
                    obj.label = this.props.language === LANGUAGES.VI ? `${item.name}` : `${item.nameEn}`
                }
                else {
                    obj.value = item.id;
                    obj.label = item.name;
                }
                result.push(obj);
            })
        }
        return result;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            this.setState({
                listDoctors: this.buildDataInputSelect(this.props.allDoctors, 'DOCTOR')
            })
        }

        if (prevProps.listPrice !== this.props.listPrice) {
            this.setState({ listPrices: this.buildDataInputSelect(this.props.listPrice, 'PRICE'), })
        }
        if (prevProps.listPayment !== this.props.listPayment) {
            this.setState({ listPayments: this.buildDataInputSelect(this.props.listPayment, 'PAYMENT') })
        }
        if (prevProps.listProvince !== this.props.listProvince) {
            this.setState({ listProvinces: this.buildDataInputSelect(this.props.listProvince, 'PROVINCE') })
        }
        if (prevProps.listSpecialties !== this.props.listSpecialties) {
            this.setState({ listSpecialties: this.buildDataInputSelect(this.props.listSpecialties, 'SPECIALTY') })
        }
        if (prevProps.listClinics !== this.props.listClinics) {
            this.setState({ listClinics: this.buildDataInputSelect(this.props.listClinics, 'CLINIC') })
        }

        if (prevProps.language !== this.props.language) {
            this.setState({
                listDoctors: this.buildDataInputSelect(this.props.allDoctors, 'DOCTOR'),
                listPrices: this.buildDataInputSelect(this.props.listPrice, 'PRICE'),
                listPayments: this.buildDataInputSelect(this.props.listPayment, 'PAYMENT'),
                listProvinces: this.buildDataInputSelect(this.props.listProvince, 'PROVINCE'),
                listSpecialties: this.buildDataInputSelect(this.props.listSpecialties, 'SPECIALTY'),
                listClinics: this.buildDataInputSelect(this.props.listClinics, 'CLINIC')
            })
        }

    }

    handleEditorChange = ({ html, text }) => {
        this.setState({ contentHTML: html, contentMarkDown: text })
    }

    handleOnchangeInput = (value, inputName) => { //thay đổi giá trị của input với name tương ứng
        let _copyState = _.cloneDeep(this.state);
        _copyState[inputName] = value;
        this.setState({ ..._copyState });
    }

    handleChangeSelectedDoctor = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption })
        await this.props.getDetailInforDoctorRedux(selectedOption.value);
        let { EM, EC, detailDoctor } = this.props;
        if (EC === 0) {
            let objMarkdown = { // gán mặc định Markdown không có thông tin
                contentHTML: '', contentMarkDown: '', description: '', hasDataMarkdown: false
            };
            let objDoctorInfor = { // gán mặc định doctor_infor không có thông tin
                note: '', selectedPrice: '', selectedPayment: '', selectedProvince: '',
                selectedSpecialty: '', selectedClinic: ''
            };
            if (detailDoctor && detailDoctor.Markdown) {
                if (detailDoctor.Markdown.description && detailDoctor.Markdown.contentHTML && detailDoctor.Markdown.contentMarkDown) { //nếu có Markdown
                    objMarkdown = {
                        contentHTML: detailDoctor.Markdown.contentHTML, contentMarkDown: detailDoctor.Markdown.contentMarkDown,
                        description: detailDoctor.Markdown.description, hasDataMarkdown: true
                    }
                }
            }
            if (detailDoctor && detailDoctor.Doctor_Infor) {
                if (detailDoctor.Doctor_Infor.priceId && detailDoctor.Doctor_Infor.paymentId && detailDoctor.Doctor_Infor.provinceId
                    && detailDoctor.Doctor_Infor.specialtyId && detailDoctor.Doctor_Infor.clinicId
                ) {
                    objDoctorInfor = {
                        note: detailDoctor.Doctor_Infor.note,
                        selectedPrice: this.state.listPrices.find(item => (item.value === detailDoctor.Doctor_Infor.priceId)),
                        selectedPayment: this.state.listPayments.find(item => (item.value === detailDoctor.Doctor_Infor.paymentId)),
                        selectedProvince: this.state.listProvinces.find(item => (item.value === detailDoctor.Doctor_Infor.provinceId)),
                        selectedSpecialty: this.state.listSpecialties.find(item => (item.value === detailDoctor.Doctor_Infor.specialtyId)),
                        selectedClinic: this.state.listClinics.find(item => (item.value === detailDoctor.Doctor_Infor.clinicId)),
                    }
                }
            }
            this.setState({
                ...this.state, ...objMarkdown, ...objDoctorInfor
            })
        }
        else {
            toast.error(EM);
        }
    }

    handleChangeSelectDoctorInfor = (selectedOption, name) => {
        let _copyState = _.cloneDeep(this.state);
        _copyState[name.name] = selectedOption;
        this.setState({ ..._copyState });
    }

    checkValidateInputs = () => {
        let arr = ['selectedDoctor', 'description', 'contentHTML', 'selectedPrice', 'selectedPayment', 'selectedProvince',
            'selectedSpecialty', 'selectedClinic'];
        for (let i = 0; i < arr.length; i++) {
            if (!this.state[arr[i]] || _.isEmpty(this.state[arr[i]])) {
                toast.error(`Empty input at '${arr[i]}' field`);
                return false;
            }
        }
        return true;
    }

    handleSave = async () => {
        if (this.checkValidateInputs()) {
            let inputData = {
                contentHTML: this.state.contentHTML, contentMarkDown: this.state.contentMarkDown,
                description: this.state.description, doctorId: this.state.selectedDoctor.value,
                action: this.state.hasDataMarkdown ? manageActions.UPDATE : manageActions.CREATE,
                selectedPrice: this.state.selectedPrice.value, selectedPayment: this.state.selectedPayment.value,
                selectedProvince: this.state.selectedProvince.value,
                note: this.state.note,
                selectedSpecialty: this.state.selectedSpecialty.value,
                selectedClinic: this.state.selectedClinic.value,
            }
            await this.props.saveInforDoctorRedux(inputData);
            let { EM, EC } = this.props;
            if (EC === 0) {
                toast.success(EM);
                this.setState({
                    contentHTML: '', contentMarkDown: '',
                    description: '', hasDataMarkdown: false, selectedDoctor: '',
                    selectedPrice: '', selectedPayment: '', selectedProvince: '',
                    note: '', selectedSpecialty: '', selectedClinic: ''
                })
            }
            else
                toast.error(EM);
        }
    }
    render() { // component luôn Render lần đầu trước khi vào DidMount() và DidUpdate()
        return (
            <>
                <div className="manage-doctors-container">
                    <div style={{ marginBottom: '15px' }} className='title'>
                        <FormattedMessage id="admin.manage-doctor.title" />
                    </div>
                    <div className='more-infor'>
                        <div className='content-left form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                            <Select value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelectedDoctor}
                                options={this.state.listDoctors}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                            />
                        </div>
                        <div className='content-right form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.infor" /></label>
                            <textarea className='form-control'
                                value={this.state.description}
                                onChange={(event) => (this.handleOnchangeInput(event.target.value, 'description'))}
                            />
                        </div>
                    </div>
                    <div className='more-infor-extra row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                            <Select
                                value={this.state.selectedPrice}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listPrices}
                                placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                                name="selectedPrice"
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                            <Select
                                value={this.state.selectedPayment}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listPayments}
                                placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                                name="selectedPayment"
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listProvinces}
                                placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                                name="selectedProvince"
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                            <input className='form-control' value={this.state.note}
                                onChange={(event) => (this.handleOnchangeInput(event.target.value, 'note'))}
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.specialty" /></label>
                            <Select
                                value={this.state.selectedSpecialty}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listSpecialties}
                                placeholder={<FormattedMessage id="admin.manage-doctor.specialty" />}
                                name="selectedSpecialty"
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.clinic" /></label>
                            <Select
                                value={this.state.selectedClinic}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listClinics}
                                placeholder={<FormattedMessage id="admin.manage-doctor.clinic" />}
                                name="selectedClinic"
                            />
                        </div>
                    </div>
                    <div className='manage-doctors-editor'>
                        <MdEditor style={{ height: '300px' }} renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkDown}
                        />
                    </div>

                    <button onClick={() => this.handleSave()} className='btn btn-primary save-content-doctor'>
                        {this.state.hasDataMarkdown ? <FormattedMessage id="admin.manage-doctor.update" /> : <FormattedMessage id="admin.manage-doctor.save" />}
                    </button>
                </div >
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        EC: state.admin.EC,
        EM: state.admin.EM,
        detailDoctor: state.admin.detailDoctor,
        listPrice: state.admin.listPrice,
        listPayment: state.admin.listPayment,
        listProvince: state.admin.listProvince,
        listSpecialties: state.admin.listSpecialties,
        listClinics: state.admin.listClinics,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctorsStart()),
        fetchRequiredDoctorInforRedux: () => dispatch(actions.fetchRequiredDoctorInfor()),
        getDetailInforDoctorRedux: (id) => dispatch(actions.getDetailInforDoctorStart(id)),
        saveInforDoctorRedux: (inputData) => dispatch(actions.saveInforDoctorStart(inputData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctors);
