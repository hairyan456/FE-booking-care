import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';

class ModalDelete extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    handleDeleteUser = async () => {
        await this.props.deleteUserRedux(this.props.userDelete);
        let { EM, EC } = this.props;
        if (EC === 0) {
            toast.success(EM);
            this.props.toggleFromParrent();
            await this.props.fetchUsersRedux(this.props.currentPage, this.props.currentLimit);
        }
        else {
            toast.error(EM);
        }
    }

    render() {
        return (
            <>
                <Modal isOpen={this.props.isShow} toggle={this.props.toggleFromParrent} className={'modal-user-container'}
                    size="md"
                >
                    <ModalHeader toggle={this.props.toggleFromParrent}><FormattedMessage id="admin.manage-user.modal-delete.title" /></ModalHeader>
                    <ModalBody>
                        <span style={{ fontSize: '18px' }}><FormattedMessage id="admin.manage-user.modal-delete.confirm" /> <span style={{ fontWeight: '500' }}>{this.props.userDelete.email} </span> ?</span>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.handleDeleteUser()} color="warning" className='px-3' > Delete </Button>
                        <Button color="danger" className='px-3' onClick={this.props.toggleFromParrent}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
        EC: state.admin.EC,
        EM: state.admin.EM,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUsersRedux: (currentPage, currentLimit) => dispatch(actions.fetchAllUsersStart(currentPage, currentLimit)),
        deleteUserRedux: (data) => dispatch(actions.deleteUserStart(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDelete);


