import axios from 'axios';

const API_URL = 'http://localhost:3000';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
};

export const register = async (userData: any) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
};

export const login = async (userData: any) => {
    console.log('Login request sent:', userData); // Debugging statement
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    console.log('Login response received:', response.data); // Debugging statement
    localStorage.setItem('token', response.data.access_token);
    response.data.redirectPath = API_URL + response.data.redirect;
    return response.data;
};

export const getUserData = async () => {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: getAuthHeader(),
      },
    });
    console.log("womp womp",getAuthHeader()); // Debugging statement
    return response.data;
  };

export const getDashboard = async (userData: any) => {
  console.log('Getting dashboard for user:', userData); // Debugging statement
    const url = `${userData.redirectPath}`;
    const response = await axios.get(`${url}`, { headers: { Authorization: getAuthHeader() }});
    return response.data;
  }