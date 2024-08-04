import axios from '../setup/axios';

// API for Login/Register/Logout user:
const loginUser = (valueLogin, password) => {
    return axios.post('/login', { valueLogin, password });
}

const registerNewUser = (inputData) => {
    return axios.post('/register', { ...inputData });
}

const getAllUsers = (page, limit) => {
    if (page && limit) {
        return axios.get(`/users/read?page=${page}&limit=${limit}`);
    }
    else {
        return axios.get('/users/read');
    }
}

const createNewUser = (userData) => {
    return axios.post('/users/create', { ...userData })
}

const updateUser = (userData) => {
    return axios.put('/users/update', { ...userData })
}

const deleteUser = (user) => {
    return axios.delete('/users/delete', { data: { id: user.id } })
}

const getAllcodes = (inputData) => {
    return axios.get(`/allcodes/read?type=${inputData}`);
}

const getTopDoctors = (limit) => {
    return axios.get(`/doctors/read-by-limit?limit=${limit}`);
}

const getAllDoctors = () => {
    return axios.get(`/doctors/read`);
}

const saveInforDoctor = (inputData) => {
    return axios.post(`/doctors/save-infor-doctor`, { ...inputData });
}

const getDetailInforDoctor = (id) => {
    return axios.get(`/doctors/get-detail-doctor-by-id?id=${id}`);
}

const getExtraInforDoctor = (id) => { //lấy thông tin: Price, Payment, Provice, NameClinic, AddressClinic...
    return axios.get(`/doctors/get-extra-infor-doctor-by-id?id=${id}`);
}

const getProfileDoctor = (id) => {
    return axios.get(`/doctors/get-profile-doctor-by-id?id=${id}`);
}

const saveBulkScheduleDoctor = (inputData) => {
    return axios.post(`/doctors/bulk-create-schedules`, (inputData));
}

const getSchedulesDoctorByDate = (doctorId, date) => {
    return axios.get(`/schedules/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
}

const postPatientBookingAppointment = (inputData) => {
    return axios.post(`/patient/booking-appoinment`, (inputData));
}

const postVerifyBookingAppointment = (doctorId, token) => {
    return axios.post(`/patient/verify-booking-appointment?token=${token}&doctorId=${doctorId}`);
}

const postCreateNewSpecialty = (inputData) => {
    return axios.post(`/specialty/create-new-specialty`, (inputData));
}

const getAllSpecialties = () => {
    return axios.get(`/specialty/read`);
}

const getDetailSpecialtyById = (id, location) => {
    return axios.get(`/specialty/get-detail-specialty-by-id?id=${id}&location=${location}`);
}

const postCreateNewClinic = (inputData) => {
    return axios.post(`/clinic/create-new-clinic`, (inputData));
}

const getAllClinics = () => {
    return axios.get(`/clinic/read`);
}

const getDetailClinicById = (id) => {
    return axios.get(`/clinic/get-detail-clinic-by-id?id=${id}`);
}

const getAllPatientsForDoctor = (doctorId, date) => {
    return axios.get(`/doctors/get-list-patients-for-doctor?doctorId=${doctorId}&date=${date}`);
}

const postSendRemedy = (inputData) => {
    return axios.post(`/doctors/send-remedy`, (inputData));
}
export {
    loginUser, registerNewUser, getAllUsers, createNewUser, updateUser, deleteUser, getAllcodes, getTopDoctors, getAllDoctors,
    saveInforDoctor, getDetailInforDoctor, saveBulkScheduleDoctor, getSchedulesDoctorByDate, getExtraInforDoctor,
    getProfileDoctor,
    postPatientBookingAppointment, postVerifyBookingAppointment, postCreateNewSpecialty, getAllSpecialties,
    getDetailSpecialtyById, postCreateNewClinic, getAllClinics, getDetailClinicById,
    getAllPatientsForDoctor, postSendRemedy

};