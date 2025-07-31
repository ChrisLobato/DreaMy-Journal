import apiClient from "./apiClient";

export const getEntriesByMonth = (email, data) => apiClient.get('/journal/entriesbymonth/' + email, {params: data})

export const getEntries = (data) => apiClient.get('/journal/entries',{params: data})

export const getStats = (email) => apiClient.get('/journal/stats/' + email)

export const postEntry = (email, data) => apiClient.post('/journal/entry/' + email, data)