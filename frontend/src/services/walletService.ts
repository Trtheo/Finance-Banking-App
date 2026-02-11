import api from './api';

export const getWalletMe = async () => {
    const response = await api.get('/wallet/me');
    return response.data;
};
