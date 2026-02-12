import api from './api';

export const getHistory = async () => {
    const response = await api.get('/transactions/history');
    return response.data;
};

export const deposit = async (amount: number, description?: string, cardId?: string) => {
    const response = await api.post('/transactions/deposit', { amount, description, cardId });
    return response.data;
};

export const withdraw = async (amount: number, description?: string, cardId?: string) => {
    const response = await api.post('/transactions/withdraw', { amount, description, cardId });
    return response.data;
};

export const transfer = async (
    receiverAccountNumber: string,
    amount: number,
    description?: string,
    cardId?: string
) => {
    const response = await api.post('/transactions/transfer', { receiverAccountNumber, amount, description, cardId });
    return response.data;
};

export const payBill = async (amount: number, description?: string, cardId?: string) => {
    const response = await api.post('/transactions/withdraw', { amount, description, cardId });
    return response.data;
};
