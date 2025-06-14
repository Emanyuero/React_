import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity ,KeyboardAvoidingView ,Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App'; 
import { Feather as Icon } from '@expo/vector-icons';
import sharedStyles from '../styles/sharedStyles';
import { API_URL } from '../api/postApi'

//const API_URL = 'https://6da9-131-226-112-101.ngrok-free.app/api';

type PersonalDetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PersonalDetailsScreen'>;
  route: RouteProp<RootStackParamList, 'PersonalDetailsScreen'>;
};

const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [editableField, setEditableField] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${API_URL}/fetchuser`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUser(data);
    setFirstName(data.first_name || '');
    setLastName(data.last_name || '');
    setUsername(data.username || '');
    setBirthdate(data.birthdate || '');
    setEmail(data.email || '');
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    const body: any = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      current_password: currentPassword,
    };
    if (password) {
      body.password = password;
      body.password_confirmation = password;
    }
    try {
      const res = await fetch(`${API_URL}/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        Alert.alert('Success', 'Profile updated!');
        fetchUser();
        setPassword('');
        setCurrentPassword('');
      } else {
        const err = await res.json();
        Alert.alert('Error', err.message || 'Failed to update profile');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <LinearGradient
      colors={['#8f5cff', '#42e695']} // Violet to green
      style={styles.gradientBg}
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

      <Text style={styles.label}>First Name</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          editable={editableField === 'firstName'}
          placeholder="First Name"
        />
        <Icon
          name="edit-2"
          size={18}
          color="#1976d2"
          style={styles.editIcon}
          onPress={() => setEditableField('firstName')}
        />
      </View>

      <Text style={styles.label}>Last Name</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={lastName}
          onChangeText={setLastName}
          editable={editableField === 'lastName'}
          placeholder="Last Name"
        />
        <Icon
          name="edit-2"
          size={18}
          color="#1976d2"
          style={styles.editIcon}
          onPress={() => setEditableField('lastName')}
        />
      </View>

      <Text style={styles.label}>Username</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={username}
          onChangeText={setUsername}
          editable={editableField === 'username'}
          placeholder="Username"
        />
        <Icon
          name="edit-2"
          size={18}
          color="#1976d2"
          style={styles.editIcon}
          onPress={() => setEditableField('username')}
        />
      </View>

      <Text style={styles.label}>Birthdate</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1, backgroundColor: '#eee' }]}
          value={birthdate}
          editable={false}
          placeholder="Birthdate"
        />
      </View>

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={email}
          onChangeText={setEmail}
          editable={editableField === 'email'}
          placeholder="Email"
          keyboardType="email-address"
        />
        <Icon
          name="edit-2"
          size={18}
          color="#1976d2"
          style={styles.editIcon}
          onPress={() => setEditableField('email')}
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={password}
          onChangeText={setPassword}
          editable={editableField === 'password'}
          placeholder="Change Password"
          secureTextEntry
        />
        <Icon
          name="edit-2"
          size={18}
          color="#1976d2"
          style={styles.editIcon}
          onPress={() => setEditableField('password')}
        />
      </View>

      <Text style={styles.label}>Current Password (required to save changes)</Text>
      <TextInput
        style={[styles.input, { marginBottom: 20 }]}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        placeholder="Current Password"
      />

      <TouchableOpacity style={sharedStyles.button} onPress={handleSave}>
        <Text style={sharedStyles.buttonText}>Save</Text>
      </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 16 },
  inputWrapper: {
    position: 'relative',
    marginTop: 4,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    paddingRight: 36,
    backgroundColor: '#fff',
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 14,
    zIndex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default PersonalDetailsScreen;