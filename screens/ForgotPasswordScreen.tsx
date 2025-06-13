import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import AppButton from '../components/AppButton';
import sharedStyles from '../styles/sharedStyles';
import { API_URL } from '../api/postApi';
import { LinearGradient } from 'expo-linear-gradient';

//const API_URL = 'https://6da9-131-226-112-101.ngrok-free.app/api';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      if (response.status === 200) {
        Alert.alert('Success', 'Password reset link sent to your email.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Error', error.response.data.message || 'Something went wrong. Please try again later.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#8f5cff', '#42e695']} // Violet to green
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{
            fontSize: 34,
            fontWeight: '900',
            marginBottom: 24,
            textAlign: 'center',
            color: '#fff',
            textShadowColor: '#8f5cff',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 8,
            letterSpacing: 2,
            fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Heavy' : 'sans-serif-black',
            textTransform: 'uppercase',
          }}>
            Forgot Password
          </Text>
          <TextInput
            style={sharedStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <AppButton title={loading ? 'Sending...' : 'Send Reset Link'} onPress={handleReset} disabled={loading} />
          <AppButton title="Back to Login" onPress={() => navigation.navigate('Login')} style={{ backgroundColor: '#eee' }} textStyle={{ color: '#1976d2' }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ForgotPasswordScreen;
