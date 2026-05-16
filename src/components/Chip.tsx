import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {theme} from '../data/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export const Chip = ({label, selected, onPress}: Props) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{selected}}
    onPress={onPress}
    style={({pressed}) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}>
    <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.line,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  selected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#E7F0F1',
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  selectedLabel: {
    color: theme.colors.primaryDark,
  },
});
