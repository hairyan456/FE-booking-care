const actionTypes = Object.freeze({
    // APP
    APP_START_UP_COMPLETE: 'APP_START_UP_COMPLETE',
    SET_CONTENT_OF_CONFIRM_MODAL: 'SET_CONTENT_OF_CONFIRM_MODAL',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',

    // USER
    USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
    USER_LOGIN_FAIL: 'USER_LOGIN_FAIL',
    PROCESS_LOGOUT: 'PROCESS_LOGOUT',

    // ADMIN
    FETCH_GENDER_START: 'FETCH_GENDER_START',
    FETCH_GENDER_SUCCESS: 'FETCH_GENDER_SUCCESS',
    FETCH_GENDER_FAILED: 'FETCH_GENDER_FAILED',

    FETCH_POSITION_START: 'FETCH_POSITION_START',
    FETCH_POSITION_SUCCESS: 'FETCH_POSITION_SUCCESS',
    FETCH_POSITION_FAILED: 'FETCH_POSITION_FAILED',

    FETCH_ROLE_START: 'FETCH_ROLE_START',
    FETCH_ROLE_SUCCESS: 'FETCH_ROLE_SUCCESS',
    FETCH_ROLE_FAILED: 'FETCH_ROLE_FAILED',

    FETCH_TIME_START: 'FETCH_TIME_START',
    FETCH_TIME_SUCCESS: 'FETCH_TIME_SUCCESS',
    FETCH_TIME_FAILED: 'FETCH_TIME_FAILED',

    FETCH_REQUIRED_DOCTOR_START: 'FETCH_REQUIRED_DOCTOR_START',
    FETCH_REQUIRED_DOCTOR_SUCCESS: 'FETCH_REQUIRED_DOCTOR_SUCCESS',
    FETCH_REQUIRED_DOCTOR_FAILED: 'FETCH_REQUIRED_DOCTOR_FAILED',

    FETCH_ALL_USERS_START: 'FETCH_ALL_USERS_START',
    FETCH_ALL_USERS_SUCCESS: 'FETCH_ALL_USERS_SUCCESS',
    FETCH_ALL_USERS_FAILED: 'FETCH_ALL_USERS_FAILED',

    CREATE_USER_START: 'CREATE_USER_START',
    CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
    CREATE_USER_FAILED: 'CREATE_USER_FAILED',

    DELETE_USER_START: 'DELETE_USER_START',
    DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
    DELETE_USER_FAILED: 'DELETE_USER_FAILED',

    UPDATE_USER_START: 'UPDATE_USER_START',
    UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
    UPDATE_USER_FAILED: 'UPDATE_USER_FAILED',

    FETCH_TOP_DOCTORS_START: 'FETCH_TOP_DOCTORS_START',
    FETCH_TOP_DOCTORS_SUCCESS: 'FETCH_TOP_DOCTORS_SUCCESS',
    FETCH_TOP_DOCTORS_FAILED: 'FETCH_TOP_DOCTORS_FAILED',

    FETCH_ALL_DOCTORS_START: 'FETCH_ALL_DOCTORS_START',
    FETCH_ALL_DOCTORS_SUCCESS: 'FETCH_ALL_DOCTORS_SUCCESS',
    FETCH_ALL_DOCTORS_FAILED: 'FETCH_ALL_DOCTORS_FAILED',

    SAVE_INFOR_DOCTOR_START: 'SAVE_INFOR_DOCTOR_START',
    SAVE_INFOR_DOCTOR_SUCCESS: 'SAVE_INFOR_DOCTOR_SUCCESS',
    SAVE_INFOR_DOCTOR_FAILED: 'SAVE_INFOR_DOCTOR_FAILED',

    GET_DETAIL_INFOR_DOCTOR_START: 'GET_DETAIL_INFOR_DOCTOR_START',
    GET_DETAIL_INFOR_DOCTOR_SUCCESS: 'GET_DETAIL_INFOR_DOCTOR_SUCCESS',
    GET_DETAIL_INFOR_DOCTOR_FAILED: 'GET_DETAIL_INFOR_DOCTOR_FAILED',

    GET_EXTRA_INFOR_DOCTOR_START: 'GET_EXTRA_INFOR_DOCTOR_START',
    GET_EXTRA_INFOR_DOCTOR_SUCCESS: 'GET_EXTRA_INFOR_DOCTOR_SUCCESS',
    GET_EXTRA_INFOR_DOCTOR_FAILED: 'GET_EXTRA_INFOR_DOCTOR_FAILED',

    GET_PROFILE_DOCTOR_START: 'GET_PROFILE_DOCTOR_START',
    GET_PROFILE_DOCTOR_SUCCESS: 'GET_PROFILE_DOCTOR_SUCCESS',
    GET_PROFILE_DOCTOR_FAILED: 'GET_PROFILE_DOCTOR_FAILED',

    SAVE_BULK_SCHEDULE_DOCTOR_START: 'SAVE_BULK_SCHEDULE_DOCTOR_START',
    SAVE_BULK_SCHEDULE_DOCTOR_SUCCESS: 'SAVE_BULK_SCHEDULE_DOCTOR_SUCCESS',
    SAVE_BULK_SCHEDULE_DOCTOR_FAILED: 'SAVE_BULK_SCHEDULE_DOCTOR_FAILED',

    CREATE_NEW_SPECIALTY_START: 'CREATE_NEW_SPECIALTY_START',
    CREATE_NEW_SPECIALTY_SUCCESS: 'CREATE_NEW_SPECIALTY_SUCCESS',
    CREATE_NEW_SPECIALTY_FAILED: 'CREATE_NEW_SPECIALTY_FAILED',

    CREATE_NEW_CLINIC_START: 'CREATE_NEW_CLINIC_START',
    CREATE_NEW_CLINIC_SUCCESS: 'CREATE_NEW_CLINIC_SUCCESS',
    CREATE_NEW_CLINIC_FAILED: 'CREATE_NEW_CLINIC_FAILED',
})

export default actionTypes;