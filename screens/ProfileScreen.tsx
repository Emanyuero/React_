import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import profileStyles from '../styles/styles';
import CreatePostModal from '../components/CreatePostModal';
import PostItem from '../components/PostItem';
import { fetchMyPosts, createPost, likePost, unlikePost, addComment, updateComment } from '../api/postApi';
import { getFollowers } from '../api/userApi';
import { User, Post, Like } from '../types';
import { API_URL } from '../api/postApi';

//const API_URL = 'https://f915-131-226-112-102.ngrok-free.app/api';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadPosts();
      loadFollowers(user.id);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/fetchuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      if (data?.id) {
        loadFollowers(data.id);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const result = await fetchMyPosts();
      setPosts(result.data ?? result);
    } catch (e) {
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadFollowers = async (userId: number) => {
    try {
      const res = await getFollowers(userId);
      const followersArr = res.data.data ?? res.data;
      setFollowers(followersArr.map((f: any) => f.follower)); 
    } catch (e) {
      setFollowers([]);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('profile_picture', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);
    try {
      await fetch(`${API_URL}/profile/update-picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      fetchProfile();
      Alert.alert('Success', 'Profile picture updated!');
    } catch (e) {
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }
    try {
      await createPost(newPostContent);
      setShowPostModal(false);
      setNewPostContent('');
      loadPosts();
      Alert.alert('Success', 'Post created!');
    } catch (e) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handleLike = async (postId: number, liked: boolean) => {
    if (!user) return;
    try {
      if (liked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
      setPosts(prevPosts =>
        prevPosts.map((post: Post) =>
          post.id === postId
            ? {
                ...post,
                likes: liked
                  ? post.likes.filter((like: Like) => String(like.user_id) !== String(user.id))
                  : [...post.likes, { user_id: String(user.id) }],
              }
            : post
        )
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const handleComment = async (postId: number, comment: string) => {
    try {
      await addComment(postId, comment);
      loadPosts();
    } catch (e) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      await updateComment(commentId, content);
      loadPosts();
    } catch (e) {
      Alert.alert('Error', 'Failed to update comment');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  if (!user) return <ActivityIndicator style={{ marginTop: 40 }} />;
  const safeUser = user!;

  return (
    <LinearGradient
      colors={['#8f5cff', '#42e695']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={
            <View>
              <View style={profileStyles.avatarWrapper}>
                <TouchableOpacity onPress={pickImage}>
                  <Image
                    source={
                      safeUser.profile_picture
                        ? {
                            uri: safeUser.profile_picture.startsWith('http')
                              ? `${safeUser.profile_picture}?t=${Date.now()}`
                              : `${API_URL.replace('/api', '')}${safeUser.profile_picture}?t=${Date.now()}`,
                          }
                        : safeUser.gender === 'female'
                          ? require('../assets/icon.png')
                          : require('../assets/icon.png')
                    }
                    style={profileStyles.avatar}
                  />
                  <View style={profileStyles.avatarCameraBtn}>
                    <Icon name="camera" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', marginTop: 8 }}>
                <Text style={profileStyles.name}>{safeUser.first_name} {safeUser.last_name}</Text>
                <Text style={profileStyles.username}>@{safeUser.username}</Text>
                <Text style={{ color: '#aaa', marginTop: 4 }}>
                  {followers.length} follower{followers.length === 1 ? '' : 's'}
                </Text>
                {uploading && <ActivityIndicator />}
              </View>
              <View style={profileStyles.postsContainer}>
                <Text style={profileStyles.sectionTitle}>Your Posts</Text>
                <View style={profileStyles.headerRow}>
                  <Image
                    source={
                      safeUser.profile_picture
                        ? {
                            uri: safeUser.profile_picture.startsWith('http')
                              ? `${safeUser.profile_picture}?t=${Date.now()}`
                              : `${API_URL.replace('/api', '')}${safeUser.profile_picture}?t=${Date.now()}`,
                          }
                        : safeUser.gender === 'female'
                          ? require('../assets/icon.png') 
                          : require('../assets/icon.png')  
                    }
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10,
                      backgroundColor: '#eee',
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPostModal(true)}
                    style={[profileStyles.mindInput, { flex: 1 }]}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: '#888' }}>
                      What's on your mind?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <PostItem
              post={item}
              userId={String(safeUser.id)}
              currentUser={user}
              onLike={handleLike}
              onComment={handleComment}
              onEditComment={handleEditComment}
              onRefresh={loadPosts}
            />
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#888', marginBottom: 16 }}>You have no posts yet.</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#1976d2',
                  paddingVertical: 12,
                  paddingHorizontal: 32,
                  borderRadius: 8,
                }}
                onPress={() => setShowPostModal(true)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Post</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />

        <CreatePostModal
          visible={showPostModal}
          value={newPostContent}
          onChangeText={setNewPostContent}
          onSubmit={handleCreatePost}
          onClose={() => setShowPostModal(false)}
          loading={uploading}
        />
      </View>
    </LinearGradient>
  );
};

export default ProfileScreen;