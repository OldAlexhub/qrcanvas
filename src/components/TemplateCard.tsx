import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Template} from '../types';
import {theme} from '../data/theme';

type Props = {
  template: Template;
  selected?: boolean;
  onPress: () => void;
};

export const TemplateCard = ({template, selected, onPress}: Props) => (
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      styles.card,
      {backgroundColor: template.colors.cardBackground},
      selected && styles.selected,
      pressed && styles.pressed,
    ]}>
    <View style={[styles.bar, {backgroundColor: template.colors.accent}]} />
    <View style={[styles.mockQr, {backgroundColor: template.colors.background}]}>
      <View style={[styles.mockLine, {backgroundColor: template.colors.foreground}]} />
      <View style={[styles.mockLineSmall, {backgroundColor: template.colors.foreground}]} />
      <View style={[styles.mockDot, {backgroundColor: template.colors.foreground}]} />
    </View>
    <Text style={[styles.name, {color: template.colors.title}]} numberOfLines={1}>
      {template.name}
    </Text>
    <Text style={[styles.description, {color: template.colors.subtitle}]} numberOfLines={2}>
      {template.description}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    width: 176,
    minHeight: 166,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00000012',
    padding: 14,
    overflow: 'hidden',
    gap: 8,
  },
  selected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  mockQr: {
    width: 58,
    height: 58,
    borderRadius: 12,
    padding: 8,
    gap: 6,
    justifyContent: 'center',
  },
  mockLine: {
    height: 8,
    borderRadius: 2,
    width: 36,
  },
  mockLineSmall: {
    height: 8,
    borderRadius: 2,
    width: 24,
  },
  mockDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '900',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});
