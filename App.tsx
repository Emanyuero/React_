// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserProvider } from './contexts/UserContext';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import PersonalDetailsScreen from './screens/PersonalDetailsScreen';
import UserProfileScreen from './screens/UserProfileScreen';


export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  HomeScreen: undefined; 
  WelcomeScreen: undefined; 
  ProfileScreen: undefined;
  PersonalDetailsScreen: undefined;
  UserProfileScreen: { userId: string };

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: true, headerTitleAlign: 'center' }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{
              headerBackVisible: false, 
              headerTitle: 'Home',
            }}
          /> 
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> 
          <Stack.Screen name="PersonalDetailsScreen" component={PersonalDetailsScreen} options={{ title: 'Personal Details' }} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{ title: 'User Profile' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
