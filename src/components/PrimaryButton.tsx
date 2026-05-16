import React from 'react';
import {Pressable, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import {theme} from '../data/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

export const PrimaryButton = ({title, onPress, disabled, variant = 'primary', style}: Props) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={({pressed}) => [
      styles.base,
      styles[variant],
      disabled && styles.disabled,
      pressed && !disabled && styles.pressed,
      style,
    ]}>
    <Text style={[styles.label, labelStyles[variant], disabled && styles.disabledLabel]}>
      {title}
    </Text>
  </Pressable>
);

const labelStyles = {
  primary: {color: '#FFFFFF'},
  secondary: {color: theme.colors.primaryDark},
  ghost: {color: theme.colors.ink},
  danger: {color: theme.colors.danger},
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: '#E7F0F1',
    borderWidth: 1,
    borderColor: '#C9DADB',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  danger: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F3B4AC',
  },
  pressed: {
    opacity: 0.78,
  },
  disabled: {
    backgroundColor: '#D5DDE1',
    borderColor: '#D5DDE1',
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  disabledLabel: {
    color: '#80909A',
  },
});
