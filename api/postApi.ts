import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://backendreact-production.up.railway.app/api';


export const fetchPosts = async (page = 1) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`${API_URL}/posts`, {
    params: { page },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data ?? res.data;
};

export const fetchMyPosts = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`${API_URL}/my-posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data ?? res.data;
};

export const createPost = async (content: string) => {
  const token = await AsyncStorage.getItem('token');
  return axios.post(`${API_URL}/posts`, { content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const likePost = async (postId: number) => {
  const token = await AsyncStorage.getItem('token');
  return axios.post(`${API_URL}/likes`, { post_id: postId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const unlikePost = async (postId: number) => {
  const token = await AsyncStorage.getItem('token');
  return axios.delete(`${API_URL}/likes`, {
    data: { post_id: postId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addComment = async (postId: number, content: string) => {
  const token = await AsyncStorage.getItem('token');
  return axios.post(`${API_URL}/comments`, { post_id: postId, content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateComment = async (commentId: number, content: string) => {
  const token = await AsyncStorage.getItem('token');
  return axios.put(`${API_URL}/comments/${commentId}`, { content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};