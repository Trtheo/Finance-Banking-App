// const API_URL = 'http://localhost:3000/api';

// export const getUserProfile = async (userId: string) => {
//     try {
//         const response = await fetch(`${API_URL}/users/${userId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         throw error;
//     }
// };

// export const updateUserProfile = async (userId: string, profileData: any) => {
//     try {
//         const response = await fetch(`${API_URL}/users/${userId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(profileData),
//         });
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error updating user profile:', error);
//         throw error;
//     }
// };
