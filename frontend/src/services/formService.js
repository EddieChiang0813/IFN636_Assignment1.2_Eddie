import axiosInstance from '../axiosConfig';

const getToken = () => localStorage.getItem('token');

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getMyForms = async () => {
  const response = await axiosInstance.get('/api/forms/my', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const createForm = async (formData) => {
  const response = await axiosInstance.post('/api/forms', formData, authConfig());
  return response.data;
};

export const getFormById = async (id) => {
  const response = await axiosInstance.get(`/api/forms/${id}`, authConfig());
  return response.data;
};

export const updateForm = async (id, formData) => {
  const response = await axiosInstance.put(`/api/forms/${id}`, formData, authConfig());
  return response.data;
};

export const deleteForm = async (id) => {
  const response = await axiosInstance.delete(`/api/forms/${id}`, authConfig());
  return response.data;
};
