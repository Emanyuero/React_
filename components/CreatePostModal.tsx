import React from 'react';
import { Modal, View, Text, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import AppButton from './AppButton';
import sharedStyles from '../styles/sharedStyles';

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
  loading = false,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={sharedStyles.modalCard}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Create Post</Text>
        <TextInput
          style={{
            width: '100%',
            minHeight: 80,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginBottom: 16,
            textAlignVertical: 'top',
            backgroundColor: '#fff',
          }}
          placeholder="What's on your mind?"
          multiline
          value={value}
          onChangeText={onChangeText}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <AppButton title="Post" onPress={onSubmit} disabled={loading} style={{ flex: 1, marginRight: 8 }} />
          <AppButton title="Cancel" onPress={onClose} disabled={loading} style={{ flex: 1, backgroundColor: '#eee' }} textStyle={{ color: '#1976d2' }} />
        </View>
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export default CreatePostModal;