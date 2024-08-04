import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SubFooter.scss'

class SubFooter
    extends Component {
    render() {
        return (
            <>
                <div className='sub-footer-container'>

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

export default connect(mapStateToProps, mapDispatchToProps)(SubFooter
);
