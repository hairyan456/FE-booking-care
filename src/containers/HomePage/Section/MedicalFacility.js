import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { getAllClinics } from '../../../services/userService'
import { toast } from 'react-toastify';
import { LANGUAGES } from '../../../utils/constant';
import { withRouter } from 'react-router-dom';

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinics();
        if (res) {
            if (res.EC !== 0)
                toast.error(res.EM)
            else
                this.setState({ listClinics: res.DT })
        }
        else console.log(res)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleViewDetailClinic = (clinicInput) => {
        this.props.history.push(`/detail-clinic/${clinicInput.id}`)
    }

    render() {
        let { listClinics } = this.state;
        return (
            <>
                <div id="facility" className='section-shared section-medical-facility'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'><FormattedMessage id="homepage.out-standing-facilities" /></span>
                            <button className='btn-section'><FormattedMessage id="homepage.more-infor" /></button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                {listClinics && listClinics.length > 0 &&
                                    listClinics.map((item, index) => {
                                        return (
                                            <div className='section-customize' onClick={() => this.handleViewDetailClinic(item)}>
                                                <div style={{ backgroundImage: `url(${item.image})` }} className='bg-image section-medical-facility'>
                                                </div>
                                                <div style={{ marginTop: '6px' }} className='text'>{item.name}</div>
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
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
