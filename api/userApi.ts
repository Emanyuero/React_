import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './postApi';

//const API_URL = 'https://6da9-131-226-112-101.ngrok-free.app/api';

export const followUser = async (followedUserId: number, followerId: number) => {
  const token = await AsyncStorage.getItem('token');
  return axios.post(`${API_URL}/follow`, {
    follower_id: followerId,
    followed_user_id: followedUserId,
    
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const unfollowUser = async (followedUserId: number, followerId: number) => {
  const token = await AsyncStorage.getItem('token');
  return axios.delete(`${API_URL}/unfollow`, {
    data: {
      follower_id: followerId,
      followed_user_id: followedUserId,
    },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getFollowers = async (userId: number) => {
  const token = await AsyncStorage.getItem('token');
  return axios.get(`${API_URL}/user/${userId}/followers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getFollowing = async (userId: number) => {
  const token = await AsyncStorage.getItem('token');
  return axios.get(`${API_URL}/user/${userId}/following`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const searchUsers = async (query: string) => {
  const token = await AsyncStorage.getItem('token');
  return axios.get(`${API_URL}/user/search?q=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};