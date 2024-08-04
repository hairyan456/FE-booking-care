import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomeFooter extends Component {
    render() {
        return (
            <>
                <div className='home-footer'>
                    <div className='content-copyright'>
                        <p>&copy; 2024 by HaiHealer.More informations,please visit my channel &#8594;
                            <a target='_blank' href='https://www.youtube.com'>Click here</a> &#8592;
                        </p>
                    </div>
                    <div className='logos'>
                        <i className="fab fa-twitter"></i> <i className="fab fa-facebook"></i>
                        <i className="fab fa-youtube"></i> <i className="fab fa-instagram"></i>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
