import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; 
import AppButton from '../components/AppButton';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeScreen'>;

const APP_NAME = 'VibeSphere';

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#8f5cff', '#42e695']} // Violet to green
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>Connect. Share. Inspire.</Text>
        <AppButton 
          title="Login" 
          onPress={() => navigation.navigate('Login')} 
          style={styles.loginBtn}
          textStyle={styles.loginBtnText}
        />
        <AppButton 
          title="Sign Up" 
          onPress={() => navigation.navigate('Signup')} 
          style={styles.signupBtn}
          textStyle={styles.signupBtnText}
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
    fontSize: 40,
    fontWeight: '900',
    color: '#8f5cff',
    fontFamily: 'sans-serif-condensed',
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: '#b3c6ff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 36,
    fontFamily: 'sans-serif-medium',
    letterSpacing: 1,
  },
  loginBtn: {
    backgroundColor: '#8f5cff',
    width: 220,
    marginBottom: 16,
    borderRadius: 30,
    elevation: 2,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'sans-serif-medium',
  },
  signupBtn: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8f5cff',
    width: 220,
    borderRadius: 30,
    elevation: 2,
  },
  signupBtnText: {
    color: '#8f5cff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'sans-serif-medium',
  },
});

export default WelcomeScreen;