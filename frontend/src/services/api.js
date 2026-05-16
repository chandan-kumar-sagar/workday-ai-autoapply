import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default API;

export const uploadResume =
  (formData) =>
    API.post(
      '/resume/upload',
      formData
    );

export const getApplications =
  () =>
    API.get('/applications');