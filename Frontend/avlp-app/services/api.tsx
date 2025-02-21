import  axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9898";

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username: string, password: string) => {
    try 
     {
      const response = await api.post("/users/login", {username, password});
      return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }    
};
