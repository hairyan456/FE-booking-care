import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { deleteUser } from '../../../services/userService';

class ModalDelete extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
    }

    handleDeleteUser = async () => {
        let res = await deleteUser(this.props.userDelete);
        if (res && res.EC === 0) {
            toast.success(res.EM);
            this.props.toggleFromParrent();
            await this.props.fetchUsers();
        } else {
            toast.error(res.EM);
        }
    }

    render() {
        return (
            <>
                <Modal isOpen={this.props.isShow} toggle={this.props.toggleFromParrent} className={'modal-user-container'}
                    size="md"
                >
                    <ModalHeader toggle={this.props.toggleFromParrent}>Delete a user</ModalHeader>
                    <ModalBody>
                        <span style={{ fontSize: '18px' }}>Do you want to delete this user <span style={{ fontWeight: '500' }}>{this.props.userDelete.email} </span> ?</span>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDelete);


