import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import _ from 'lodash';
import ModalCreate from './ModalCreate';
import ModalDelete from './ModalDelete';
import ModalUpdate from './ModalUpdate';
import { LANGUAGES } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUsers: [],
            isShowModalUser: false, isShowModalDelete: false, isShowModalUpdate: false,
            userDelete: {}, userUpdate: {},
            currentPage: 1, currentLimit: 4, totalPages: 0
        }
    }

    async componentDidMount() {
        await this.props.fetchUsersRedux(this.state.currentPage, this.state.currentLimit);
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.currentPage !== this.state.currentPage) {
            await this.props.fetchUsersRedux(this.state.currentPage, this.state.currentLimit);
        }

        if (prevProps.DT.users !== this.props.DT.users) {
            this.setState({
                listUsers: this.props.DT.users,
                totalPages: this.props.DT.totalPages
            })
        }
    }

    // Modal CREATE user
    handleAddNewUser = () => {
        this.setState({ isShowModalUser: true })
    }
    toggleUserModal = () => {
        this.setState({ isShowModalUser: !this.state.isShowModalUser })
    }

    //Modal DELETE User
    handleDeleteUser = (user) => {
        this.setState({
            userDelete: user, isShowModalDelete: true
        });
    }
    toggleModalDelete = () => {
        this.setState({
            userDelete: {}, isShowModalDelete: !this.state.isShowModalDelete
        });
    }

    //Modal UPDATE User
    handleUpdateUser = (user) => {
        this.setState({ userUpdate: user, isShowModalUpdate: true })
    }
    toggleUserUpdate = () => {
        this.setState({ userUpdate: {}, isShowModalUpdate: !this.state.isShowModalUpdate })
    }

    // Invoke when user click to request another page.
    handlePageClick = (event) => {
        this.setState({ currentPage: +(event.selected) + 1 })
    };

    render() { // component luôn Render lần đầu trước khi vào DidMount() và DidUpdate()
        let { listUsers, currentPage, currentLimit } = this.state;
        return (
            <>
                <div className="user-redux-container">
                    <ModalUpdate isShow={this.state.isShowModalUpdate} userUpdate={this.state.userUpdate} toggleFromParrent={this.toggleUserUpdate} currentPage={this.state.currentPage} currentLimit={this.state.currentLimit} />
                    <ModalDelete isShow={this.state.isShowModalDelete} userDelete={this.state.userDelete} toggleFromParrent={this.toggleModalDelete} currentPage={this.state.currentPage} currentLimit={this.state.currentLimit} />
                    <ModalCreate isShow={this.state.isShowModalUser} toggleFromParrent={this.toggleUserModal} currentPage={this.state.currentPage} currentLimit={this.state.currentLimit} />
                    <div className='title'>Manage users using Redux</div>
                    <div className='mx-2'>
                        <button onClick={() => this.handleAddNewUser()} className='btn btn-primary px-3'> <i className='fas fa-plus'></i>  <FormattedMessage id="admin.manage-user.add" /></button>
                    </div>

                    <div className='users-table mt-3 mx-2'>
                        <table id="customers">
                            <thead>
                                <tr>
                                    <th scope='col'>No</th>
                                    <th scope='col'>Email</th>
                                    <th scope='col'>FirstName</th>
                                    <th scope='col'>LastName</th>
                                    <th scope='col'>Address</th>
                                    <th scope='col'>Role</th>
                                    <th scope='col'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUsers && listUsers.length > 0 ?
                                    <>
                                        {listUsers.map((user, index) => {
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <td>{(currentPage - 1) * currentLimit + (index + 1)}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.firstName}</td>
                                                    <td>{user.lastName}</td>
                                                    <td>{user.address}</td>
                                                    <td>{this.props.language === LANGUAGES.VI ? user.roleData.valueVi : user.roleData.valueEn}</td>
                                                    <td>
                                                        <button onClick={() => this.handleUpdateUser(user)} style={{ marginRight: '15px' }} title='Edit' className='btn btn-warning' ><i className='fas fa-pencil-alt'></i></button>
                                                        <button onClick={() => this.handleDeleteUser(user)} className='btn btn-danger' title='Delete'><i className='fas fa-trash'></i></button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </>
                                    :
                                    <>
                                        <tr style={{ color: 'red' }}><td>Not found users</td></tr>
                                    </>
                                }
                            </tbody>
                        </table>
                    </div>
                    {this.state.totalPages > 0 &&
                        <div className='user-footer'>
                            <ReactPaginate
                                nextLabel="next >"
                                onPageChange={this.handlePageClick}
                                pageRangeDisplayed={3}  //tính từ bên trái ... 
                                marginPagesDisplayed={2}  // tính từ bên phải ...
                                pageCount={this.state.totalPages}
                                previousLabel="< previous"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    }
                </div >
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        DT: state.admin.DT,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUsersRedux: (currentPage, currentLimit) => dispatch(actions.fetchAllUsersStart(currentPage, currentLimit)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
