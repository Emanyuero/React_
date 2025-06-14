import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  iconLeft?: React.ReactNode; // <-- Add this line
};

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled,
  iconLeft, // <-- Add this line
}) => (
  <TouchableOpacity onPress={onPress} style={style} disabled={disabled}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {iconLeft && <View style={{ marginRight: 6 }}>{iconLeft}</View>}
      <Text style={textStyle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export default AppButton;