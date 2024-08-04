import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllSpecialties } from '../../../services/userService'
import { toast } from 'react-toastify';
import { LANGUAGES } from '../../../utils/constant';
import { withRouter } from 'react-router-dom';

class Specialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listSpecialties: []
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialties();
        if (res) {
            if (res.EC !== 0)
                toast.error(res.EM)
            else
                this.setState({ listSpecialties: res.DT && res.DT.length > 0 ? res.DT : [] })
        }
        else console.log(res)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleViewDetailSpecialty = (specialtyInput) => {
        this.props.history.push(`/detail-specialty/${specialtyInput.id}`)
    }
    render() {
        let { listSpecialties } = this.state;
        return (
            <>
                <div id='specialty' className='section-shared section-specialty'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'><FormattedMessage id="homepage.popular-specialties" /></span>
                            <button className='btn-section'><FormattedMessage id="homepage.more-infor" /></button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                {listSpecialties && listSpecialties.length > 0 &&
                                    listSpecialties.map((item, index) => {
                                        return (
                                            <div className='section-customize' onClick={() => this.handleViewDetailSpecialty(item)}>
                                                <div style={{ backgroundImage: `url(${item.image})` }} className='bg-image section-specialty'>
                                                </div>
                                                <div className='text'>
                                                    {this.props.language === LANGUAGES.VI ? item.name : item.nameEn}
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
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
