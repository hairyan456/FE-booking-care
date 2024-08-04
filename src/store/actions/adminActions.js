import actionTypes from './actionTypes';
import {
    getAllcodes, createNewUser, getAllUsers, deleteUser, updateUser, getTopDoctors, getAllDoctors,
    saveInforDoctor, getDetailInforDoctor, saveBulkScheduleDoctor, getExtraInforDoctor, getProfileDoctor,
    postCreateNewSpecialty, getAllSpecialties, postCreateNewClinic, getAllClinics
} from '../../services/userService';

// GENDER Actions
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START });
            let res = await getAllcodes('GENDER');
            if (res && res.EC === 0) {
                dispatch(fetchGenderSuccess(res.DT));
            }
            else {
                dispatch(fetchGenderFailed());
                console.log(res);
            }
        }
        catch (err) {
            dispatch(fetchGenderFailed());
            console.log('Check error in fetchGenderStart(): ', err);
        }
    }
}
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

// POSITION Actions
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_POSITION_START });
            let res = await getAllcodes('POSITION');
            if (res && res.EC === 0) {
                dispatch(fetchPositionSuccess(res.DT));
            }
            else {
                dispatch(fetchPositionFailed());
                console.log(res);
            }
        }
        catch (err) {
            dispatch(fetchPositionFailed());
            console.log('Check error in fetchPositionStart(): ', err);
        }
    }
}
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

// ROLE Actions
export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_START });
            let res = await getAllcodes('ROLE');
            if (res && res.EC === 0) {
                dispatch(fetchRoleSuccess(res.DT));
            }
            else {
                dispatch(fetchRoleFailed());
                console.log(res);
            }
        }
        catch (err) {
            dispatch(fetchRoleFailed());
            console.log('Check error in fetchRoleStart(): ', err);
        }
    }
}
export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

// TIME Actions:
export const fetchTimeStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_TIME_START });
            let res = await getAllcodes('TIME');
            if (res && res.EC === 0) {
                dispatch({
                    type: actionTypes.FETCH_TIME_SUCCESS,
                    data: res.DT
                });
            }
            else {
                console.log(res);
                dispatch({
                    type: actionTypes.FETCH_TIME_FAILED,
                });
            }
        }
        catch (err) {
            console.log('Check error in fetchTimeStart(): ', err);
            dispatch({
                type: actionTypes.FETCH_TIME_FAILED,
            });
        }
    }
}

// REQUIRE_DOCTOR_INFOR (Price, Payment, Province  3 in 1)
export const fetchRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_START });
            let resPrice = await getAllcodes('PRICE');
            let resPayment = await getAllcodes('PAYMENT');
            let resProvince = await getAllcodes('PROVINCE');
            let resSpecialties = await getAllSpecialties();
            let resClinics = await getAllClinics();
            if (resPrice && resPrice.EC === 0 && resPayment && resPayment.EC === 0 && resProvince && resProvince.EC === 0
                && resSpecialties && resSpecialties.EC === 0 && resClinics && resClinics.EC === 0) {
                dispatch({
                    type: actionTypes.FETCH_REQUIRED_DOCTOR_SUCCESS,
                    data: {
                        resPrice: resPrice, resPayment: resPayment, resProvince: resProvince,
                        resSpecialties: resSpecialties,
                        resClinics: resClinics
                    }
                });
            }
            else {
                console.log(resPrice);
                console.log(resPayment);
                console.log(resProvince);
                console.log(resSpecialties);
                console.log(resClinics);
                dispatch({
                    type: actionTypes.FETCH_REQUIRED_DOCTOR_FAILED,
                });
            }
        }
        catch (err) {
            console.log('Check error in fetchRequiredDoctorInfor(): ', err);
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_FAILED,
            });
        }
    }
}

// CREATE new user:
export const createUser = (userData) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.CREATE_USER_START });
            let res = await createNewUser(userData);
            if (res) {
                if (res.EC === 0) {
                    dispatch(createNewUserSuccess(res));
                }
                else {  // email/phone existed or password.length <3
                    dispatch(createNewUserFailed(res));
                }
            }
        }
        catch (err) {
            dispatch(createNewUserFailed());
            console.log('Check error in createNewUser(): ', err);
        }
    }
}
export const createNewUserSuccess = (response) => ({
    type: actionTypes.CREATE_USER_SUCCESS,
    EM: response.EM, EC: response.EC
})
export const createNewUserFailed = (response) => ({
    type: actionTypes.CREATE_USER_FAILED,
    EM: response.EM, EC: response.EC, DT: response.DT
})

// READ all users:
export const fetchAllUsersStart = (currentPage, currentLimit) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_USERS_START });
            if (currentLimit === 0) {
                let response = await getAllUsers();
                if (response && response.EC === 0)
                    dispatch(fetchAllUsersSuccess(response.DT));
                else {
                    dispatch(fetchAllUsersFailed());
                    console.log(response);
                }
            }
            else {
                let response = await getAllUsers(currentPage, currentLimit);
                if (response && response.EC === 0)
                    dispatch(fetchAllUsersSuccess(response.DT));
                else {
                    dispatch(fetchAllUsersFailed());
                    console.log(response);
                }
            }

        }
        catch (err) {
            dispatch(fetchAllUsersFailed());
            console.log('Check error in fetchAllUsersStart(): ', err);
        }
    }
}
export const fetchAllUsersSuccess = (usersData) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    data: usersData,
})
export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})

// DELETE user:
export const deleteUserStart = (userDelete) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.DELETE_USER_START });
            let res = await deleteUser(userDelete);
            if (res) {
                if (res.EC === 0) {
                    dispatch(deleteUserSuccess(res));
                }
                else {
                    dispatch(deleteUserFailed(res));
                }
            }
        }
        catch (err) {
            dispatch(deleteUserFailed());
            console.log('Check error in deleteUser(): ', err);
        }
    }
}
export const deleteUserSuccess = (response) => ({
    type: actionTypes.DELETE_USER_SUCCESS,
    EM: response.EM, EC: response.EC
})
export const deleteUserFailed = (response) => ({
    type: actionTypes.DELETE_USER_FAILED,
    EM: response.EM, EC: response.EC
})

// UPDATE  user:
export const updateUserStart = (userData) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.UPDATE_USER_START });
            let res = await updateUser(userData);
            if (res) {
                if (res.EC === 0) {
                    dispatch(updateUserSuccess(res));
                }
                else {
                    dispatch(updateUserFailed(res));
                }
            }
        }
        catch (err) {
            dispatch(updateUserFailed());
            console.log('Check error in updateUserStart(): ', err);
        }
    }
}
export const updateUserSuccess = (response) => ({
    type: actionTypes.UPDATE_USER_SUCCESS,
    EM: response.EM, EC: response.EC
})
export const updateUserFailed = (response) => ({
    type: actionTypes.UPDATE_USER_FAILED,
    EM: response.EM, EC: response.EC, DT: response.DT
})

// Top doctors:
export const fetchTopDoctorsStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_TOP_DOCTORS_START });
            let res = await getTopDoctors('10');
            if (res && res.EC === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    data: res.DT,
                });
            }
            else {
                dispatch({ type: actionTypes.FETCH_TOP_DOCTORS_FAILED });
                console.log(res);
            }
        }
        catch (err) {
            dispatch({ type: actionTypes.FETCH_TOP_DOCTORS_FAILED });
            console.log('Check error in fetchTopDoctorsStart(): ', err);
        }
    }
}

// GET all doctors:
export const fetchAllDoctorsStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_DOCTORS_START });
            let res = await getAllDoctors();
            if (res && res.EC === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    data: res.DT,
                });
            }
            else {
                dispatch({ type: actionTypes.FETCH_ALL_DOCTORS_FAILED });
                console.log(res);
            }
        }
        catch (err) {
            dispatch({ type: actionTypes.FETCH_ALL_DOCTORS_FAILED });
            console.log('Check error in fetchAllDoctorsStart(): ', err);
        }
    }
}

// SAVE infor doctor
export const saveInforDoctorStart = (inputData) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.SAVE_INFOR_DOCTOR_START });
            let res = await saveInforDoctor(inputData);
            if (res) {
                if (res.EC === 0) {
                    dispatch({
                        type: actionTypes.SAVE_INFOR_DOCTOR_SUCCESS,
                        EM: res.EM, EC: res.EC
                    });
                }
                else {
                    dispatch({
                        type: actionTypes.SAVE_INFOR_DOCTOR_FAILED,
                        EM: res.EM, EC: res.EC, DT: res.DT
                    });
                }
            }
        }
        catch (err) {
            dispatch({
                type: actionTypes.SAVE_INFOR_DOCTOR_FAILED,
            });
            console.log('Check error in saveInforDoctorStart(): ', err);
        }
    }
}

//get detail infor doctor by id:
export const getDetailInforDoctorStart = (id) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.GET_DETAIL_INFOR_DOCTOR_START });
            let res = await getDetailInforDoctor(id);
            if (res && res.EC === 0) {
                dispatch({
                    type: actionTypes.GET_DETAIL_INFOR_DOCTOR_SUCCESS,
                    DT: res.DT, EM: res.EM, EC: res.EC
                });
            }
            else {
                dispatch({
                    type: actionTypes.GET_DETAIL_INFOR_DOCTOR_FAILED,
                    DT: res.DT, EM: res.EM, EC: res.EC
                });
                console.log(res);
            }
        }
        catch (err) {
            dispatch({ type: actionTypes.GET_DETAIL_INFOR_DOCTOR_FAILED });
            console.log('Check error in getDetailInforDoctorStart(): ', err);
        }
    }
}

// get extra infor doctor (Price,Payment,Province, Clinic...) by id:
export const getExtraInforDoctorStart = (id) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.GET_EXTRA_INFOR_DOCTOR_START });
            let res = await getExtraInforDoctor(id);
            if (res && res.EC === 0) {
                dispatch({
                    type: actionTypes.GET_EXTRA_INFOR_DOCTOR_SUCCESS,
                    res: res
                });
            }
            else {
                dispatch({
                    type: actionTypes.GET_EXTRA_INFOR_DOCTOR_FAILED,
                    res: res
                });
                console.log(res);
            }
        }
        catch (err) {
            dispatch({ type: actionTypes.GET_EXTRA_INFOR_DOCTOR_FAILED });
            console.log('Check error in getExtraInforDoctorStart(): ', err);
        }
    }
}

// get profile doctor:
export const getProfileDoctorStart = (id) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.GET_PROFILE_DOCTOR_START });
            let res = await getProfileDoctor(id);
            if (res && res.EC === 0) {
                dispatch({
                    type: actionTypes.GET_PROFILE_DOCTOR_SUCCESS,
                    res: res
                });
            }
            else {
                dispatch({
                    type: actionTypes.GET_PROFILE_DOCTOR_FAILED,
                    res: res
                });
                console.log(res);
            }
        }
        catch (err) {
            dispatch({ type: actionTypes.GET_PROFILE_DOCTOR_FAILED });
            console.log('Check error in getProfileDoctorStart(): ', err);
        }
    }
}

// save bulk schedules doctor:
export const saveBulkScheduleDoctorStart = (inputData) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_START });
            let res = await saveBulkScheduleDoctor(inputData);
            if (res) {
                if (res.EC === 0) {
                    dispatch({
                        type: actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_SUCCESS,
                        res: res
                    });
                }
                else {
                    dispatch({
                        type: actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_FAILED,
                        res: res
                    });
                    console.log(res);
                }
            }
        }
        catch (err) {
            dispatch({
                type: actionTypes.SAVE_BULK_SCHEDULE_DOCTOR_FAILED,
            });
            console.log('Check error in saveBulkScheduleDoctorStart(): ', err);
        }
    }
}

// Create new Specialty
export const createNewSpecialtyStart = (inputData) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.CREATE_NEW_SPECIALTY_START });
            let res = await postCreateNewSpecialty(inputData);
            if (res) {
                if (res.EC === 0) {
                    dispatch({
                        type: actionTypes.CREATE_NEW_SPECIALTY_SUCCESS,
                        res: res
                    });
                }
                else {
                    dispatch({
                        type: actionTypes.CREATE_NEW_SPECIALTY_FAILED,
                        res: res
                    });
                }
            }
        }
        catch (err) {
            dispatch({
                type: actionTypes.CREATE_NEW_SPECIALTY_FAILED,
            });
            console.log('Check error in createNewSpecialtyStart(): ', err);
        }
    }
}

// Create new Clinic
export const createNewClinicStart = (inputData) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.CREATE_NEW_CLINIC_START });
            let res = await postCreateNewClinic(inputData);
            if (res) {
                if (res.EC === 0) {
                    dispatch({
                        type: actionTypes.CREATE_NEW_CLINIC_SUCCESS,
                        res: res
                    });
                }
                else {
                    dispatch({
                        type: actionTypes.CREATE_NEW_CLINIC_FAILED,
                        res: res
                    });
                }
            }
        }
        catch (err) {
            dispatch({
                type: actionTypes.CREATE_NEW_CLINIC_FAILED,
            });
            console.log('Check error in createNewClinicStart(): ', err);
        }
    }
}

