import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PrimaryButton} from './PrimaryButton';
import {theme} from '../data/theme';

type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({title, message, actionLabel, onAction}: Props) => (
  <View style={styles.wrap}>
    <View style={styles.mark}>
      <Text style={styles.markText}>QR</Text>
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {actionLabel && onAction ? (
      <PrimaryButton title={actionLabel} onPress={onAction} style={styles.button} />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#E7F0F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: theme.colors.primaryDark,
    fontWeight: '900',
    fontSize: 16,
  },
  title: {
    color: theme.colors.ink,
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center',
  },
  message: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 4,
  },
});
