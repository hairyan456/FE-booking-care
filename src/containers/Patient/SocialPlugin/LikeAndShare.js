import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';

class LikeAndShare extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    initFacebookSDK() {
        if (window.FB) {
            window.FB.XFBML.parse();
        }

        let { language } = this.props;
        let locale = language === LANGUAGES.VI ? 'vi_VN' : 'en_US'
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID,
                cookie: true,  // enable cookies to allow the server to access
                // the session
                xfbml: true,  // parse social plugins on this page 
                version: 'v2.5' // use version 2.1
            });
        };
        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = `//connect.facebook.net/${locale}/sdk.js`;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    componentDidMount() {
        this.initFacebookSDK();
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.initFacebookSDK();
        }
    }

    render() {
        let { dataHref } = this.props;
        return (
            <>
                <div className='fb-like'
                    data-href={dataHref}
                    data-width=""
                    data-layout="standard"
                    data-action="like"
                    data-size="small"
                    data-share="true"
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(LikeAndShare);
