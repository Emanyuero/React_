import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, TextInput } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
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
  const [comment, setComment] = useState('');
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
      <Text style={{
  fontSize: 17,
  color: '#222',
  marginBottom: 12,
  marginLeft: 2,
  marginRight: 2,
  lineHeight: 24,
  fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'sans-serif',
}}>
        {post.content}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 2, gap: 18 }}>
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 18,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 18,
      backgroundColor: likedByUser ? '#ffeaea' : '#f7f7ff',
    }}
    onPress={() => onLike(post.id, likedByUser)}
    activeOpacity={0.7}
  >
    <Icon name="thumbs-up" size={20} color={likedByUser ? "#e74c3c" : "#888"} style={{ marginRight: 4 }} />
    <Text style={{ marginLeft: 6, color: likedByUser ? '#e74c3c' : '#888', fontSize: 15, fontWeight: 'bold' }}>
      {post.likes?.length || 0}
    </Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 18,
      backgroundColor: '#f7f7ff',
    }}
    onPress={() => setShowComments((prev) => !prev)}
    activeOpacity={0.7}
  >
    <Icon name="message-circle" size={20} color="#888" style={{ marginRight: 4 }} />
    <Text style={{ marginLeft: 6, color: '#888', fontSize: 15, fontWeight: 'bold' }}>
      {post.comments?.length || 0}
    </Text>
  </TouchableOpacity>
</View>
      {showComments && (
  <View style={{
    marginTop: 10,
    backgroundColor: '#f7f7ff',
    borderRadius: 14,
    padding: 10,
  }}>
    {post.comments && post.comments.length > 0 ? (
      post.comments.map((c) => (
        <View key={c.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          <Icon name="user" size={20} color="#8f5cff" style={{ marginRight: 8, backgroundColor: '#f7f7ff', borderRadius: 12, padding: 3 }} />
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            paddingVertical: 8,
            paddingHorizontal: 14,
            maxWidth: '85%',
            borderWidth: 1,
            borderColor: '#e6e6e6',
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#8f5cff', marginBottom: 2 }}>
              {c.user?.first_name} {c.user?.last_name}
            </Text>
            <Text style={{ fontSize: 15, color: '#222' }}>{c.content}</Text>
          </View>
        </View>
      ))
    ) : (
      <Text style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginVertical: 8 }}>No comments yet.</Text>
    )}
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      backgroundColor: '#fff',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: Platform.OS === 'ios' ? 10 : 0,
      borderWidth: 1,
      borderColor: '#e6e6e6',
    }}>
      <Icon name="user" size={18} color="#8f5cff" style={{ marginRight: 8, backgroundColor: '#f7f7ff', borderRadius: 12, padding: 3 }} />
      <TextInput
        style={{
          flex: 1,
          fontSize: 15,
          paddingVertical: 8,
          paddingHorizontal: 10,
          color: '#222',
          backgroundColor: 'transparent',
        }}
        placeholder="Write a comment..."
        value={comment}
        onChangeText={setComment}
        placeholderTextColor="#aaa"
        onSubmitEditing={() => {
          if (comment.trim()) {
            onComment(post.id, comment);
            setComment('');
          }
        }}
        returnKeyType="send"
      />
      <TouchableOpacity
        style={{
          marginLeft: 6,
          padding: 6,
          borderRadius: 16,
          backgroundColor: '#f7f7ff',
        }}
        onPress={() => {
          if (comment.trim()) {
            onComment(post.id, comment);
            setComment('');
          }
        }}
        activeOpacity={0.7}
      >
        <Icon name="send" size={18} color="#8f5cff" />
      </TouchableOpacity>
    </View>
  </View>
)}
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