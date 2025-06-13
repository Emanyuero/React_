import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AppButton from '../components/AppButton';
import sharedStyles from '../styles/sharedStyles';
import { API_URL } from '../api/postApi';
import { LinearGradient } from 'expo-linear-gradient';

//const API_URL = 'https://f915-131-226-112-102.ngrok-free.app/api';

const SignUpScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setBirthdate(iso);
    }
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !username || !gender || !birthdate || !email || !password || !passwordConfirmation) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        first_name: firstName,
        last_name: lastName,
        username,
        gender,
        birthdate,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Account created! Please log in.');
        navigation.replace('Login');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to sign up.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errors = error.response.data.errors;
        if (errors) {
          const firstKey = Object.keys(errors)[0];
          Alert.alert('Error', errors[firstKey][0]);
        } else {
          Alert.alert('Error', error.response.data.message || 'Something went wrong. Please try again later.');
        }
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
            Sign Up
          </Text>
          <TextInput style={sharedStyles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          <TextInput style={sharedStyles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          <TextInput style={sharedStyles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
          <View style={[sharedStyles.input, { padding: 0, marginBottom: 16 }]}>
            <Picker
              selectedValue={gender}
              onValueChange={setGender}
              style={{ height: 48, width: '100%' }}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={sharedStyles.input}
              placeholder="Birthdate (YYYY-MM-DD)"
              value={birthdate}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthdate ? new Date(birthdate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          <TextInput style={sharedStyles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={sharedStyles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <TextInput
            style={sharedStyles.input}
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry
          />
          <AppButton title={loading ? 'Signing up...' : 'Sign Up'} onPress={handleSignUp} disabled={loading} />
          <AppButton title="Already have an account? Login" onPress={() => navigation.replace('Login')} style={{ backgroundColor: '#eee' }} textStyle={{ color: '#1976d2' }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default SignUpScreen;