import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; 
import AppButton from '../components/AppButton';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // Add icon import

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
          style={styles.socialBtn}
          textStyle={styles.socialBtnText}
          iconLeft={<Feather name="log-in" size={20} color="#fff" />}
        />
        <AppButton 
          title="Sign Up" 
          onPress={() => navigation.navigate('Signup')} 
          style={[styles.socialBtn, styles.socialBtnOutline]}
          textStyle={[styles.socialBtnText, styles.socialBtnOutlineText]}
          iconLeft={<Feather name="user-plus" size={20} color="#8f5cff" />}
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
    fontFamily: 'sans-serif-medium',
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

export default WelcomeScreen;