import React, { Component } from 'react';
import { connect } from "react-redux";
import './ModalRemedy.scss';
import { LANGUAGES } from '../../../utils/constant';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils';

class ModalRemedy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientEmail: '', imgBase64: ''
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({ patientEmail: this.props.dataModal && this.props.dataModal.email ? this.props.dataModal.email : '' })
        }
    }

    closeModalBooking = () => {
        this.setState({ patientEmail: '', imgBase64: '' });
        this.props.closeModal();
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            });
        }
    }

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
        this.closeModalBooking();
    }
    render() {
        let { patientEmail } = this.state;
        return (
            <>
                <Modal isOpen={this.props.isOpen} className={'booking-modal-container'} size="md"
                    centered zIndex={'10000'} toggle={() => this.closeModalBooking()}>
                    <ModalHeader toggle={() => this.closeModalBooking()}>Xác nhận gửi hóa đơn khám bệnh</ModalHeader>
                    <ModalBody>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>Email bệnh nhân</label>
                                <input className='form-control' type='email' placeholder='Type patient email...' value={patientEmail}
                                    onChange={(event) => { this.setState({ patientEmail: event.target.value }) }} />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Chọn file đơn thuốc</label>
                                <input onChange={(event) => this.handleOnChangeImage(event)} className='form-control-file' type='file' />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleSendRemedy()}>
                            Send
                        </Button>{' '}
                        <Button color="danger" onClick={() => this.closeModalBooking()}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal >
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalRemedy);
