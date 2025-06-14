import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal, Image, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import PostItem from '../components/PostItem';
import CommentsModal from '../components/CommentsModal';
import CreatePostModal from '../components/CreatePostModal';
import styles from '../styles/styles';
import { fetchPosts, createPost, likePost, unlikePost, addComment, updateComment } from '../api/postApi';
import { searchUsers } from '../api/userApi';
import { User, Post } from '../types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App'; 
import { API_URL } from '../api/postApi';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // For search icon

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  
  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }
      const response = await fetch(`${API_URL}/fetchuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
      setUserId(data.id.toString());
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user information.');
    }
  };

  const fetchPostsHandler = async (reset = false) => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await fetchPosts(reset ? 1 : page);
      const newData: Post[] = Array.isArray(data) ? data : [];
      setPosts((prev) => {
        const combined = reset ? newData : [...prev, ...newData];
        const uniquePosts = Array.from(new Map(combined.map(post => [post.id, post])).values());
        return uniquePosts;
      });
      if (!reset) setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !userId) return;
    try {
      setLoading(true);
      const response = await createPost(newPost);
      const newPostObj = {
        ...response.data.post,
        likes: response.data.post.likes ?? [],
        comments: response.data.post.comments ?? [],
      };
      setPosts((prev) => [newPostObj, ...prev]);
      setNewPost('');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number, liked: boolean) => {
    if (!userId) return;
    try {
      if (liked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
      fetchPostsHandler(true);
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  const handleComment = async (postId: number, comment: string) => {
    if (!userId) return;
    try {
      await addComment(postId, comment);
      fetchPostsHandler(true);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      const response = await updateComment(commentId, content);
      return response.data.comment ?? {
        id: commentId,
        content,
        user: user, 
      };
    } catch (e) {
      Alert.alert('Error', 'Failed to update comment');
      return undefined;
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      await AsyncStorage.removeItem('token');
      setUserId(null);
      setPosts([]);
      setNewPost('');
      setPage(1);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPostsHandler(true);
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await searchUsers(searchQuery);
      setSearchResults(res.data);
    } catch (e: any) {

      Alert.alert('Error', 'Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [])
  );

  useEffect(() => {
    if (userId) {
      fetchPostsHandler(true);
    }
  }, [userId]);

  useEffect(() => {
    let isActive = true;

    if (searchQuery.trim() !== '') {
      (async () => {
        setSearching(true);
        try {
          const res = await searchUsers(searchQuery);
          if (isActive) setSearchResults(res.data);
        } catch (e) {
          if (isActive) setSearchResults([]);
        } finally {
          if (isActive) setSearching(false);
        }
      })();
    } else {
      setSearchResults([]);
    }

    return () => {
      isActive = false;
    };
  }, [searchQuery]);

  return (
    <LinearGradient
      colors={['#8f5cff', '#42e695']} // Violet to green
      style={homeStyles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={homeStyles.overlay}>
        {userId ? (
          <>
            {/* Redesigned Search Bar */}
            <View style={homeStyles.searchBarContainer}>
              <Ionicons name="search" size={20} color="#8f5cff" style={homeStyles.searchIcon} />
              <TextInput
                style={homeStyles.searchInput}
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                placeholderTextColor="#aaa"
                underlineColorAndroid="transparent"
              />
            </View>
            {/* --- End Redesigned Search Bar --- */}

            {searchQuery.trim() === '' && (
              <View style={styles.headerRow}>
                <TouchableOpacity
                  onPress={() => { navigation.navigate('ProfileScreen'); }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={
                      user?.profile_picture
                        ? {
                            uri: user.profile_picture.startsWith('http')
                              ? user.profile_picture
                              : `${API_URL.replace('/api', '')}${user.profile_picture}`,
                          }
                        : user?.gender === 'female'
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
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mindInput, { flex: 1 }, homeStyles.postInput]}
                  onPress={() => setShowPostModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#888' }}>
                    What's on your mind?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.burgerBtn}>
                  <Icon name="menu" size={28} color="#444" />
                </TouchableOpacity>
              </View>
            )}


            <Modal
              visible={showMenu}
              transparent
              animationType="fade"
              onRequestClose={() => setShowMenu(false)}
            >
              <TouchableOpacity style={styles.menuOverlay} onPress={() => setShowMenu(false)}>
                <View style={styles.menuModal}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMenu(false);
                      navigation.navigate('ProfileScreen');
                    }}
                    style={styles.menuItem}
                  >
                    <Icon name="user" size={20} color="#1976d2" />
                    <Text style={{ color: '#1976d2', marginLeft: 8 }}>Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMenu(false);
                      navigation.navigate('PersonalDetailsScreen');
                    }}
                    style={styles.menuItem}
                  >
                    <Icon name="info" size={20} color="#1976d2" />
                    <Text style={{ color: '#1976d2', marginLeft: 8 }}>Personal Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMenu(false);
                      handleLogout();
                    }}
                    style={styles.menuItem}
                  >
                    <Icon name="log-out" size={20} color="red" />
                    <Text style={{ color: 'red', marginLeft: 8 }}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>


            <CreatePostModal
              visible={showPostModal}
              value={newPost}
              onChangeText={setNewPost}
              onSubmit={async () => {
                await handleCreatePost();
                setShowPostModal(false);
              }}
              onClose={() => setShowPostModal(false)}
              loading={loading}
            />


            {searchQuery.trim() !== '' && !searching ? (
              searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderBottomWidth: 1,
                        borderColor: '#eee',
                        backgroundColor: '#fff',
                      }}
                      onPress={() => {
                        setSearchResults([]);
                        setSearchQuery('');
                        navigation.navigate('UserProfileScreen', { userId: String(item.id) });
                      }}
                    >
                      <Image
                        source={
                          item.profile_picture
                            ? { uri: item.profile_picture }
                            : item.gender === 'female'
                              ? require('../assets/icon.png')
                              : require('../assets/icon.png')
                        }
                        style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
                      />
                      <View>
                        <Text style={{ fontWeight: 'bold' }}>{item.first_name} {item.last_name}</Text>
                        <Text style={{ color: '#888' }}>@{item.username}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  style={{ marginBottom: 12 }}
                />
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#888', fontSize: 16 }}>No User Found</Text>
                </View>
              )
            ) : (
              <FlatList
                data={posts}
                renderItem={({ item }) => (
                  <PostItem
                    post={item}
                    userId={userId}
                    currentUser={user ?? undefined}
                    onLike={handleLike}
                    onComment={handleComment}
                    onRefresh={handleRefresh}
                    onEditComment={handleEditComment}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                onEndReached={() => {
                  if (!loading && !isFetchingMore) {
                    setIsFetchingMore(true);
                    fetchPostsHandler();
                  }
                }}
                onEndReachedThreshold={0.2}
                ListFooterComponent={loading ? <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} /> : null}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            )}
          </>
        ) : (
          <ActivityIndicator style={{ marginTop: 20 }} />
        )}
      </View>
    </LinearGradient>
  );
};

const homeStyles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#8f5cff',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    elevation: 2,
    marginBottom: 0,
    marginTop: 0,
  },
  postInput: {
    backgroundColor: '#f7faff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    elevation: 2,
    marginBottom: 0,
    marginTop: 0,
    justifyContent: 'center',
  },
});

export default HomeScreen;