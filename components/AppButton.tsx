import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import sharedStyles from '../styles/sharedStyles';

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

const AppButton: React.FC<Props> = ({ title, onPress, style, textStyle, disabled }) => (
  <TouchableOpacity
    style={[sharedStyles.button, style, disabled && { opacity: 0.6 }]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[sharedStyles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export default AppButton;