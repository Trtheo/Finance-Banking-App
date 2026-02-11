import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3002';

const getAuthToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const createCard = async (cardData: {
    cardType: string;
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}) => {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cardData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create card');
    }

    return await response.json();
};

export const getUserCards = async () => {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/cards/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch cards');
    }

    return await response.json();
};

export const updateCard = async (cardId: string, updateData: any) => {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update card');
    }

    return await response.json();
};

export const deleteCard = async (cardId: string) => {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete card');
    }

    return await response.json();
};