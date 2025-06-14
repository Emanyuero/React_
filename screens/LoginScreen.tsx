// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppButton from '../components/AppButton';
import sharedStyles from '../styles/sharedStyles';
import { useUser } from '../contexts/UserContext';
import { API_URL } from '../api/postApi';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // <-- Add this import

const LoginScreen = ({ navigation }: any) => {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        usernameoremail: email,
        password,
      });
      if (response.status === 200) {
        const { token, user } = response.data;
        await AsyncStorage.setItem('token', token);
        setUser(user);
        navigation.replace('HomeScreen');
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
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
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back to VibeSphere!</Text>
        <TextInput
          style={[sharedStyles.input, styles.input]}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
        <TextInput
          style={[sharedStyles.input, styles.input]}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          placeholderTextColor="#888"
        />
        <AppButton
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          style={styles.socialBtn}
          textStyle={styles.socialBtnText}
          disabled={loading}
          iconLeft={<Feather name="log-in" size={20} color="#fff" />}
        />
        <AppButton
          title="Sign Up"
          onPress={() => navigation.navigate('Signup')}
          style={[styles.socialBtn, styles.socialBtnOutline]}
          textStyle={[styles.socialBtnText, styles.socialBtnOutlineText]}
          iconLeft={<Feather name="user-plus" size={20} color="#8f5cff" />}
        />
        <AppButton
          title="Forgot Password?"
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotBtn}
          textStyle={styles.forgotBtnText}
          iconLeft={<Feather name="unlock" size={18} color="#3bb2b8" />}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#8f5cff',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Heavy' : 'sans-serif-condensed',
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 36,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Medium' : 'sans-serif-medium',
    letterSpacing: 1,
    textAlign: 'center',
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    elevation: 2,
    width: 260,
  },
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
  forgotBtn: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: 220,
    borderRadius: 30,
    elevation: 0,
    marginBottom: 0,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotBtnText: {
    color: '#3bb2b8',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Medium' : 'sans-serif-medium',
    textAlign: 'center',
    textDecorationLine: 'underline',
    letterSpacing: 1,
    marginLeft: 8,
  },
});

export default LoginScreen;
