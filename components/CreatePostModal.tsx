import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
};

const CreatePostModal: React.FC<Props> = ({
  visible,
  value,
  onChangeText,
  onSubmit,
  onClose,
  loading,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView
      style={styles.modalOverlay}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Create a Post</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="What's on your mind?"
          value={value}
          onChangeText={onChangeText}
          multiline
          numberOfLines={4}
          maxLength={500}
          placeholderTextColor="#aaa"
        />
        <View style={styles.modalBtnRow}>
          <TouchableOpacity
            style={[styles.modalBtn, styles.cancelBtn]}
            onPress={onClose}
            disabled={loading}
          >
            <Icon name="x" size={18} color="#8f5cff" style={{ marginRight: 4 }} />
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalBtn, styles.postBtn]}
            onPress={onSubmit}
            disabled={loading || !value.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            ) : (
              <Icon name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.postBtnText}>{loading ? 'Posting...' : 'Post'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'stretch',
    elevation: 8,
    shadowColor: '#8f5cff',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    minHeight: 220,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8f5cff',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#f7f7ff',
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginLeft: 0,
  },
  cancelBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8f5cff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    minWidth: 80,
  },
  postBtn: {
    backgroundColor: '#8f5cff',
    minWidth: 120,
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#8f5cff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});

export default CreatePostModal;