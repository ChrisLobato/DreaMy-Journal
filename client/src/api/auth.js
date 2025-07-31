import apiClient from "./apiClient";

export const registerUser = (data) => apiClient.post('/auth/register', data);

export const loginUser = (data) => apiClient.post('/auth/login',data);

export const logoutUser = () => apiClient.get('/auth/logout');

export const getLoggedIn = () => apiClient.get('/auth/loggedIn');