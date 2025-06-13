import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
//import Icon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Feather';
import CommentsModal from './CommentsModal';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { API_URL } from '../api/postApi'; 
import type { Post, User, Comment } from '../types';
import type { Like } from '../types';

type PostItemProps = {
  post: Post;
  userId: string;
  currentUser?: User;
  onLike: (postId: number, liked: boolean) => Promise<void>;
  onComment: (postId: number, comment: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onEditComment: (commentId: number, content: string) => Promise<void | Comment>;
};

//const API_URL = 'https://6da9-131-226-112-101.ngrok-free.app/api';

const PostItem: React.FC<PostItemProps> = ({
  post,
  userId,
  onLike,
  onComment,
  onRefresh,
  onEditComment,
  currentUser, 
}) => {
  const [showComments, setShowComments] = useState(false);
  const likedByUser = !!userId && post.likes.some((like) => String(like.user_id) === userId);
  const displayUser =
  currentUser && String(post.user?.id) === String(currentUser.id)
    ? currentUser
    : post.user;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfileScreen', { userId: String(post.user.id) })}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Image
            source={
              displayUser.profile_picture
                ? { uri: displayUser.profile_picture }
                : require('../assets/icon.png')
            }
            style={styles.avatar}
          />
          <Text style={{ fontWeight: 'bold' }}>
            {post.user.first_name} {post.user.last_name} ({post.user.username})
          </Text>
        </TouchableOpacity>
      </View>
      <Text>{post.content}</Text>
      <View style={{ flexDirection: 'row', marginTop: 10, borderTopWidth: 1, borderColor: '#222', paddingTop: 10 }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 32 }}
          onPress={() => onLike(post.id, likedByUser)}
        >
          <Icon name="thumbs-up" size={22} color={likedByUser ? '#1976d2' : '#aaa'} />
          <Text style={{ color: likedByUser ? '#1976d2' : '#aaa', marginLeft: 6 }}>
            Like{post.likes && post.likes.length > 0 ? ` (${post.likes.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => setShowComments(true)}
        >
          <Icon name="message-circle" size={22} color="#aaa" />
          <Text style={{ color: '#aaa', marginLeft: 6 }}>
            Comment{post.comments && post.comments.length > 0 ? ` (${post.comments.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
      <CommentsModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        post={post}
        userId={userId}
        onComment={onComment}
        onRefresh={onRefresh}
        onEditComment={onEditComment} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 18,
    padding: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    backgroundColor: '#eee',
  },
});

export default PostItem;