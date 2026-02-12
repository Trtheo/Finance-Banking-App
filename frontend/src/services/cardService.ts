import api from './api';

export interface CardItem {
    _id: string;
    cardNumber: string;
    cardHolderName?: string;
    cardholderName?: string;
    expiryDate: string;
    status: 'active' | 'blocked';
    cardType?: string;
    network?: string;
    createdAt?: string;
}

export const createCard = async (cardHolderName: string) => {
    const response = await api.post('/cards', { cardHolderName });
    return response.data?.card ?? response.data;
};

export const getCards = async (): Promise<CardItem[]> => {
    const response = await api.get('/cards');
    return response.data;
};

export const freezeCard = async (cardId: string) => {
    const response = await api.patch(`/cards/${cardId}/freeze`);
    return response.data;
};

export const unfreezeCard = async (cardId: string) => {
    const response = await api.patch(`/cards/${cardId}/unfreeze`);
    return response.data;
};

export const deleteCard = async (cardId: string) => {
    const response = await api.delete(`/cards/${cardId}`);
    return response.data;
};
