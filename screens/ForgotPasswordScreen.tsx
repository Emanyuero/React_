import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import AppButton from '../components/AppButton';
import sharedStyles from '../styles/sharedStyles';
import { API_URL } from '../api/postApi';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

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
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center', // <-- add this line
            padding: 24
          }}
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
          <AppButton
            title={loading ? 'Sending...' : 'Send Reset Link'}
            onPress={handleReset}
            disabled={loading}
            style={styles.socialBtn}
            textStyle={styles.socialBtnText}
            iconLeft={<Feather name="mail" size={20} color="#fff" />}
          />
          <AppButton
            title="Back to Login"
            onPress={() => navigation.navigate('Login')}
            style={[styles.socialBtn, styles.socialBtnOutline]}
            textStyle={[styles.socialBtnText, styles.socialBtnOutlineText]}
            iconLeft={<Feather name="arrow-left" size={20} color="#8f5cff" />}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8f5cff',
    width: 220,
    marginBottom: 16,
    borderRadius: 25,
    elevation: 3,
    paddingVertical: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    shadowColor: '#8f5cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  socialBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-medium',
    marginLeft: 8,
  },
  socialBtnOutline: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8f5cff',
    elevation: 2,
    shadowOpacity: 0.08,
  },
  socialBtnOutlineText: {
    color: '#8f5cff',
  },
});

export default ForgotPasswordScreen;
