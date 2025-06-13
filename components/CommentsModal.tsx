import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import sharedStyles from '../styles/sharedStyles';
import { Comment, Post } from '../types';

type CommentsModalProps = {
  visible: boolean;
  onClose: () => void;
  post: Post;
  userId: string | null;
  onComment: (id: number, comment: string) => Promise<Comment | void>;
  onEditComment: (id: number, content: string) => Promise<Comment | void>;
  onRefresh?: () => Promise<void>;
};

const CommentsModal: React.FC<CommentsModalProps> = ({ visible, onClose, post, userId, onComment, onEditComment }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    setComments(post.comments);
  }, [post.comments]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    const newComment = await onComment(post.id, comment);
    if (newComment) setComments([...comments, newComment]);
    setComment('');
  };

  const handleEditComment = async (id: number, content: string) => {
    if (!content.trim()) return;
    const updatedComment = await onEditComment(id, content);
    if (updatedComment) {
      setComments(comments.map((c) =>
        c.id === id
          ? { ...updatedComment, user: updatedComment.user ?? c.user }
          : c
      ));
      setEditingCommentId(null);
      setEditContent('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.15)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={sharedStyles.modalCard}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 14, color: '#222' }}>
            Comments
          </Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  marginBottom: 14,
                  backgroundColor: '#f0f4f8',
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                {editingCommentId === item.id ? (
                  <>
                    <TextInput
                      value={editContent}
                      onChangeText={setEditContent}
                      style={{
                        borderWidth: 1,
                        borderColor: '#d0d7de',
                        borderRadius: 8,
                        padding: 10,
                        backgroundColor: '#fff',
                        marginBottom: 8,
                        fontSize: 15,
                      }}
                      placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity
                      onPress={async () => {
                        await handleEditComment(item.id, editContent);
                        // Do NOT call setEditingCommentId(null) here, it's already handled in handleEditComment
                      }}
                      style={{
                        backgroundColor: '#1976d2',
                        paddingVertical: 10,
                        paddingHorizontal: 18,
                        borderRadius: 8,
                        marginBottom: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setEditingCommentId(null)}
                      style={{ marginBottom: 4 }}
                    >
                      <Text style={{ color: '#888', fontSize: 15 }}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {item.user?.username ?? 'User'}:
                    </Text>
                    <Text style={{ color: '#222', marginBottom: 4 }}>{item.content}</Text>
                    {item.user && String(item.user.id) === String(userId) && (
                      <TouchableOpacity
                        onPress={() => {
                          setEditingCommentId(item.id);
                          setEditContent(item.content);
                        }}
                        style={{ marginTop: 4 }}
                      >
                        <Text style={{ color: '#1976d2', fontWeight: '500' }}>Edit</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>
                No comments yet.
              </Text>
            }
            style={{ marginBottom: 12 }}
            contentContainerStyle={{ flexGrow: 1 }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <TextInput
              placeholder="Add a comment..."
              value={comment}
              onChangeText={setComment}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#d0d7de',
                borderRadius: 8,
                padding: 10,
                backgroundColor: '#fff',
                marginRight: 8,
                fontSize: 15,
              }}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              onPress={handleAddComment}
              style={{
                backgroundColor: '#1976d2',
                paddingVertical: 10,
                paddingHorizontal: 18,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Post</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 16, alignSelf: 'flex-end', padding: 6 }}
          >
            <Text style={{ color: '#888', fontSize: 15 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CommentsModal;