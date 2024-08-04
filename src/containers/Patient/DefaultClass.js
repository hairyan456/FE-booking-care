import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss';
import { LANGUAGES } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';

class DefaultClass extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {

        return (
            <>

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

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
