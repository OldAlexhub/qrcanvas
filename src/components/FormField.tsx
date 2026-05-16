import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {theme} from '../data/theme';

type Props = TextInputProps & {
  label: string;
  helper?: string;
  error?: string;
};

export const FormField = ({label, helper, error, style, ...props}: Props) => (
  <View style={styles.wrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      placeholderTextColor="#8A98A2"
      style={[styles.input, props.multiline && styles.multiline, error && styles.inputError, style]}
      {...props}
    />
    {Boolean(error) && <Text style={styles.error}>{error}</Text>}
    {!error && Boolean(helper) && <Text style={styles.helper}>{helper}</Text>}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: theme.colors.ink,
    fontSize: 16,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#E08479',
    backgroundColor: '#FFF7F6',
  },
  helper: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  error: {
    color: theme.colors.danger,
    fontSize: 12,
    lineHeight: 16,
  },
});
