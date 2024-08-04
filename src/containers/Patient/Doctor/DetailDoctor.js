import React, { Component } from 'react';
import { connect } from "react-redux";
import HeaderHomePage from '../../HomePage/Header/HeaderHomePage';
import './DetailDoctor.scss';
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import DoctorSchedules from './DoctorSchedules';
import DoctorExtraInfor from './DoctorExtraInfor';
import Lightbox from 'react-image-lightbox'; //thư viện để click ảnh sẽ phóng to ảnh ra
import SubFooter from '../../HomePage/Footer/SubFooter';
import HomeFooter from '../../HomePage/Footer/HomeFooter';

import Comment from '../SocialPlugin/Comment';
import LikeAndShare from '../SocialPlugin/LikeAndShare';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {}, isOpenAvatar: false
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            await this.props.getDetailInforDoctorRedux(this.props.match.params.id);
            let { EM, EC, detailDoctor } = this.props;
            if (EC === 0) {
                let imageBase64 = '';
                if (detailDoctor && detailDoctor.image) {
                    imageBase64 = new Buffer(detailDoctor.image, 'base64').toString('binary');
                }
                this.setState({ detailDoctor: { ...detailDoctor, image: imageBase64 } })
            }
            else {
                console.log(EM)
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    openAvatar = () => {
        let { detailDoctor } = this.state;
        if (!detailDoctor.image) return; //nếu chưa tải ảnh lên sẽ không cho xem trước!
        this.setState({ isOpenAvatar: true });
    }
    render() {
        let { detailDoctor } = this.state;
        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        let currentURL = +process.env.REACT_APP_IS_LOCALHOST === 1 ? "https://hoidanit.vn/" : window.location.href;
        return (
            <>
                <HeaderHomePage isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='introduction'>
                        <div className='content-left' style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}
                            onClick={() => this.openAvatar()}
                        />
                        <div className='content-right'>
                            <div className='up'>{this.props.language === LANGUAGES.VI ? nameVi : nameEn}</div>
                            <div className='down'>
                                {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.description &&
                                    <span>
                                        {detailDoctor.Markdown.description}
                                    </span>
                                }
                                <div style={{ marginTop: '25px' }} className='like-share-plugin'>
                                    <LikeAndShare dataHref={currentURL} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='schedule'>
                        <div className='content-left'>
                            <DoctorSchedules doctorId={this.props.match.params && this.props.match.params.id ? this.props.match.params.id : -1} />
                        </div>
                        <div className='content-right'>
                            <DoctorExtraInfor doctorId={this.props.match.params && this.props.match.params.id ? this.props.match.params.id : -1} />
                        </div>
                    </div>
                    <div className='detail-infor'>
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}></div>
                        }
                    </div>
                    <div className='comment'>
                        <Comment dataHref={currentURL} width={"100%"} />
                    </div>
                </div>

                {this.state.isOpenAvatar &&
                    <Lightbox
                        mainSrc={detailDoctor.image}
                        onCloseRequest={() => this.setState({ isOpenAvatar: false })}
                    />
                }
                <SubFooter />
                <HomeFooter />
            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        EC: state.admin.EC,
        EM: state.admin.EM,
        detailDoctor: state.admin.detailDoctor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailInforDoctorRedux: (id) => dispatch(actions.getDetailInforDoctorStart(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
