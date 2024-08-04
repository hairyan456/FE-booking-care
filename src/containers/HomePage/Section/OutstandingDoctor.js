import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils/constant';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

class OutstandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: []
        }
    }
    componentDidMount() {
        this.props.fetchTopDoctorsRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctors !== this.props.topDoctors) {
            this.setState({ listDoctors: this.props.topDoctors });
        }
    }

    handleViewDetailDoctor = (doctorInput) => {
        this.props.history.push(`/detail-doctor/${doctorInput.id}`)
    }
    render() {
        let { listDoctors } = this.state, { language } = this.props;
        return (
            <>
                <div id="doctor" className='section-shared section-outstanding-doctor'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'><FormattedMessage id="homepage.out-standing-doctor" /></span>
                            <button className='btn-section'><FormattedMessage id="homepage.more-infor" /></button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                {listDoctors && listDoctors.length > 0 &&
                                    listDoctors.map((item, index) => {
                                        let imageBase64 = '';
                                        if (item.image)
                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                        let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                        let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                        return (
                                            <div className='section-customize' key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                                <div className='customize-border'>
                                                    <div className='outer-bg'>
                                                        <div className='bg-image section-outstanding-doctor'
                                                            style={{ backgroundImage: `url(${imageBase64})` }}
                                                        />
                                                    </div>
                                                    <div className='infor text-center'>
                                                        <div className='text'>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                        <div style={{ fontWeight: '550' }}>
                                                            {item.Doctor_Infor && item.Doctor_Infor.Specialty ?
                                                                (language === LANGUAGES.VI ? `Khoa ${item.Doctor_Infor.Specialty.name}` : item.Doctor_Infor.Specialty.nameEn)
                                                                :
                                                                ''
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </Slider>
                        </div>
                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctors: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchTopDoctorsRedux: () => dispatch(actions.fetchTopDoctorsStart())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor));
