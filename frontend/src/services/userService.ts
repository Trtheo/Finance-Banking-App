import api from './api';

export const getUserMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const updateProfile = async (profileData: any) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
};
