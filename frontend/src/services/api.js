import axios from 'axios';

const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'https://workday-ai-autoapply-production.up.railway.app/api') + '/',
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
    API.get('applications');