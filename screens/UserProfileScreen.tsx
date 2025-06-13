import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import profileStyles from '../styles/styles';
import PostItem from '../components/PostItem';
import { unlikePost, likePost, addComment, updateComment } from '../api/postApi';
import { followUser, unfollowUser ,getFollowers} from '../api/userApi';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App';
import type { Like, User, Post, Comment } from '../types';
import AppButton from '../components/AppButton';
import { API_URL } from '../api/postApi';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // Add this import at the top with other imports

//const API_URL = 'https://f915-131-226-112-102.ngrok-free.app/api';

type UserProfileScreenProps = {
  route: RouteProp<RootStackParamList, 'UserProfileScreen'>;
};

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState<User | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchUserAndPosts();
    fetchCurrentUser();
  }, [userId]);

  useEffect(() => {
    if (currentUser && user) {
      checkIfFollowing();
    }
  }, [currentUser, user]);

  const fetchUserAndPosts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const userRes = await fetch(`${API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) {
        setLoading(false);
        return;
      }
      const userData = await userRes.json();
      setUser(userData);

      const postsRes = await fetch(`${API_URL}/user/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!postsRes.ok) {
        setLoading(false);
        return;
      }
      const postsData = await postsRes.json();
      setPosts(postsData.data ?? postsData);
    } catch (e) {
      Alert.alert('Error', 'Failed to load user or posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_URL}/fetchuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setCurrentUser(data);
    } catch (e) {}
  };

  const checkIfFollowing = async () => {
    if (!currentUser || !user) return;
    try {
      const followersRes = await getFollowers(user.id);
      const followers = followersRes.data.data ?? followersRes.data;
      setFollowers(followers.map((f: any) => f.follower));
      setIsFollowing(
        followers.some((f: any) => String(f.follower.id) === String(currentUser.id))
      );
    } catch (e) {
      setIsFollowing(false);
      setFollowers([]);
    }
  };

  const handleLike = async (postId: number, liked: boolean) => {
    if (!currentUser) return;
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
                  ? post.likes.filter((like: Like) => String(like.user_id) !== String(currentUser.id))
                  : [...post.likes, { user_id: String(currentUser.id) }],
              }
            : post
        )
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const handleComment = async (postId: number, content: string) => {
    try {
      await addComment(postId, content);
      fetchUserAndPosts();
    } catch (e) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      await updateComment(commentId, content);
      fetchUserAndPosts();
    } catch (e) {
      Alert.alert('Error', 'Failed to update comment');
    }
  };

  const handleFollow = async () => {
    if (!user || !currentUser) return;
    setFollowLoading(true);
    try {
      await followUser(user.id, currentUser.id);
      await checkIfFollowing();
    } catch (e: any) {
      if (e?.response?.status === 409) {
        Alert.alert('Info', 'You are already following this user.');
        await checkIfFollowing();
      } else if (e?.response?.status === 422) {
        Alert.alert('Error', 'Invalid user information.');
      } else {
        Alert.alert('Error', 'Failed to follow user');
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!user || !currentUser) return;
    try {
      await unfollowUser(user.id, currentUser.id);
      await checkIfFollowing();
    } catch (e: any) {
      Alert.alert('Error', 'Failed to unfollow user');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserAndPosts();
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!user) {
    return (
      <LinearGradient
        colors={['#8f5cff', '#42e695']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>User not found.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#8f5cff', '#42e695']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <View>
            <View style={profileStyles.avatarWrapper}>
              <Image
                source={
                  user.profile_picture
                    ? {
                        uri: user.profile_picture.startsWith('http')
                          ? user.profile_picture
                          : `${API_URL.replace('/api', '')}${user.profile_picture}`,
                      }
                    : user.gender === 'female'
                      ? require('../assets/icon.png')
                      : require('../assets/icon.png')
                }
                style={profileStyles.avatar}
              />
            </View>
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <Text style={profileStyles.name}>{user.first_name} {user.last_name}</Text>
              <Text style={profileStyles.username}>@{user.username}</Text>
              <Text style={{ color: '#aaa', marginTop: 4 }}>
                {followers.length} follower{followers.length === 1 ? '' : 's'}
              </Text>
            </View>
            {currentUser && user && currentUser.id !== user.id && (
              isFollowing ? (
                <AppButton
                  title="Unfollow"
                  onPress={handleUnfollow}
                  style={{
                    backgroundColor: '#eee',
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 18,
                    borderRadius: 20,
                    minHeight: 36,
                    minWidth: 90,
                  }}
                  textStyle={{
                    color: '#1976d2',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginLeft: 6,
                    letterSpacing: 1,
                  }}
                  iconLeft={<Feather name="user-minus" size={18} color="#1976d2" />}
                />
              ) : (
                <AppButton
                  title="Follow"
                  onPress={handleFollow}
                  style={{
                    backgroundColor: '#1976d2',
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 18,
                    borderRadius: 20,
                    minHeight: 36,
                    minWidth: 90,
                  }}
                  textStyle={{
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginLeft: 6,
                    letterSpacing: 1,
                  }}
                  iconLeft={<Feather name="user-plus" size={18} color="#fff" />}
                  disabled={followLoading}
                />
              )
            )}
            <View style={profileStyles.postsContainer}>
              <Text style={profileStyles.sectionTitle}>Posts</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <PostItem
            post={item}
            userId={currentUser ? String(currentUser.id) : ''}
            currentUser={currentUser}
            onLike={handleLike}
            onComment={handleComment}
            onEditComment={handleEditComment}
            onRefresh={fetchUserAndPosts}
          />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#888', marginBottom: 16 }}>No posts yet.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </LinearGradient>
  );
};

export default UserProfileScreen;