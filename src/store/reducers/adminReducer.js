import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [], roles: [], positions: [], time: [],
    isLoadingGender: false, isLoadingPosition: false, isLoadingRole: false,
    EC: '', EM: '', DT: '',
    isFetchingUsers: false, users: [],
    isFetchingTopDoctors: false, topDoctors: [],
    isFetchingAllDoctors: false, allDoctors: [],
    detailDoctor: '', extraInforDoctor: '', profileDoctor: '',
    listPrice: [], listPayment: [], listProvince: [], listSpecialties: [], listClinics: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            state.isLoadingGender = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoadingGender = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.genders = [];
            state.isLoadingGender = false;
            return {
                ...state,
            }

        case actionTypes.FETCH_POSITION_START:
            state.isLoadingPosition = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;
            state.isLoadingPosition = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = [];
            state.isLoadingPosition = false;
            return {
                ...state,
            }

        case actionTypes.FETCH_ROLE_START:
            state.isLoadingRole = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            state.isLoadingRole = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            state.isLoadingRole = false;
            return {
                ...state,
            }

        case actionTypes.FETCH_TIME_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_TIME_SUCCESS:
            state.time = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_TIME_FAILED:
            state.time = [];
            return {
                ...state,
            }

        case actionTypes.FETCH_REQUIRED_DOCTOR_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_SUCCESS:
            state.listPrice = action.data.resPrice.DT;
            state.listPayment = action.data.resPayment.DT;
            state.listProvince = action.data.resProvince.DT;
            state.listSpecialties = action.data.resSpecialties.DT;
            state.listClinics = action.data.resClinics.DT;
            return {
                ...state,
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_FAILED:
            state.listPrice = [];
            state.listPayment = [];
            state.listProvince = [];
            return {
                ...state,
            }

        case actionTypes.CREATE_USER_START:
            return {
                ...state,
            }
        case actionTypes.CREATE_USER_SUCCESS:
            state.EC = action.EC;
            state.EM = action.EM;
            return {
                ...state,
            }
        case actionTypes.CREATE_USER_FAILED:
            state.EC = action.EC;
            state.EM = action.EM;
            state.DT = action.DT;
            return {
                ...state,
            }

        case actionTypes.FETCH_ALL_USERS_START:
            state.isFetchingUsers = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.DT = action.data;
            state.isFetchingUsers = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.DT = {};
            state.isFetchingUsers = false;
            return {
                ...state,
            }

        case actionTypes.DELETE_USER_START:
            return {
                ...state,
            }
        case actionTypes.DELETE_USER_SUCCESS:
            state.EC = action.EC;
            state.EM = action.EM;
            return {
                ...state,
            }
        case actionTypes.DELETE_USER_FAILED:
            state.EC = action.EC;
            state.EM = action.EM;
            return {
                ...state,
            }

        case actionTypes.UPDATE_USER_START:
            return {
                ...state,
            }
        case actionTypes.UPDATE_USER_SUCCESS:
            state.EC = action.EC;
            state.EM = action.EM;
            return {
                ...state,
            }
        case actionTypes.UPDATE_USER_FAILED:
            state.EC = action.EC;
            state.EM = action.EM;
            state.DT = action.DT;
            return {
                ...state,
            }

        case actionTypes.FETCH_TOP_DOCTORS_START:
            state.isFetchingTopDoctors = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            state.topDoctors = action.data;
            state.isFetchingTopDoctors = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_TOP_DOCTORS_FAILED:
            state.topDoctors = [];
            state.isFetchingTopDoctors = false;
            return {
                ...state,
            }

        case actionTypes.FETCH_ALL_DOCTORS_START:
            state.isFetchingAllDoctors = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            state.allDoctors = action.data;
            state.isFetchingAllDoctors = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTORS_FAILED:
            state.allDoctors = [];
            state.isFetchingAllDoctors = false;
            return {
                ...state,
            }

        case actionTypes.SAVE_INFOR_DOCTOR_START:
            return {
                ...state,
            }
        case actionTypes.SAVE_INFOR_DOCTOR_SUCCESS:
            state.EC = action.EC;
            state.EM = action.EM;
            return {
                ...state,
            }
        case actionTypes.SAVE_INFOR_DOCTOR_FAILED:
            state.EC = action.EC;
            state.EM = action.EM;
            state.DT = action.DT;
            return {
                ...state,
            }

        case actionTypes.GET_DETAIL_INFOR_DOCTOR_START:
            return {
                ...state,
            }
        case actionTypes.GET_DETAIL_INFOR_DOCTOR_SUCCESS:
            state.detailDoctor = action.DT;
            state.EM = action.EM;
            state.EC = action.EC;
            return {
                ...state,
            }
        case actionTypes.GET_DETAIL_INFOR_DOCTOR_FAILED:
            state.detailDoctor = '';
            state.EM = action.EM;
            state.EC = action.EC;
            return {
                ...state,
            }

        case actionTypes.GET_EXTRA_INFOR_DOCTOR_START:
            return {
                ...state,
            }
        case actionTypes.GET_EXTRA_INFOR_DOCTOR_SUCCESS:
            state.extraInforDoctor = action.res.DT;
            state.EM = action.res.EM;
            state.EC = action.res.EC;
            return {
                ...state,
            }
        case actionTypes.GET_EXTRA_INFOR_DOCTOR_FAILED:
            state.extraInforDoctor = '';
            state.EM = action.res.EM;
            state.EC = action.res.EC;
            return {
                ...state,
            }

        case actionTypes.GET_PROFILE_DOCTOR_START:
            return {
                ...state,
            }
        case actionTypes.GET_PROFILE_DOCTOR_SUCCESS:
            state.profileDoctor = action.res.DT;
            state.EM = action.res.EM;
            state.EC = action.res.EC;
            return {
                ...state,
            }
        case actionTypes.GET_PROFILE_DOCTOR_FAILED:
            state.profileDoctor = '';
            state.EM = action.res.EM;
            state.EC = action.res.EC;
            return {
                ...state,
            }

        case actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_START:
            return {
                ...state,
            }
        case actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_SUCCESS:
            state.EC = action.res.EC;
            state.EM = action.res.EM;
            return {
                ...state,
            }
        case actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_FAILED:
            state.EC = action.res.EC;
            state.EM = action.res.EM;
            return {
                ...state,
            }

        case actionTypes.CREATE_NEW_SPECIALTY_START:
            return {
                ...state,
            }
        case actionTypes.CREATE_NEW_SPECIALTY_SUCCESS:
            state.EC = action.res.EC;
            state.EM = action.res.EM;
            return {
                ...state,
            }
        case actionTypes.CREATE_NEW_SPECIALTY_FAILED:
            state.EC = action.res.EC;
            state.EM = action.res.EM;
            return {
                ...state,
            }

        case actionTypes.CREATE_NEW_CLINIC_START:
            return {
                ...state,
            }
        case actionTypes.CREATE_NEW_CLINIC_SUCCESS:
            state.EC = action.res.EC;
            state.EM = action.res.EM;
            return {
                ...state,
            }
        case actionTypes.CREATE_NEW_CLINIC_FAILED:
            state.EC = action.res.EC;
            state.EM = action.res.EM;
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;