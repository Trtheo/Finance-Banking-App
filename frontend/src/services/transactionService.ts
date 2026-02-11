import api from './api';

export const getHistory = async () => {
    const response = await api.get('/transactions/history');
    return response.data;
};

export const deposit = async (amount: number, description?: string) => {
    const response = await api.post('/transactions/deposit', { amount, description });
    return response.data;
};

export const withdraw = async (amount: number, description?: string) => {
    const response = await api.post('/transactions/withdraw', { amount, description });
    return response.data;
};

export const transfer = async (receiverAccountNumber: string, amount: number, description?: string) => {
    const response = await api.post('/transactions/transfer', { receiverAccountNumber, amount, description });
    return response.data;
};
