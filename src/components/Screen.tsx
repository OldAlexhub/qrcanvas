import React, {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../data/theme';

type Props = PropsWithChildren<{
  scroll?: boolean;
  footer?: React.ReactNode;
}>;

export const Screen = ({children, scroll = true, footer}: Props) => (
  <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
    {scroll ? (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, footer ? styles.contentWithFooter : null]}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    ) : (
      <View style={styles.flex}>{children}</View>
    )}
    {footer}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.surfaceAlt,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 120,
    gap: theme.spacing.lg,
  },
  contentWithFooter: {
    paddingBottom: 24,
  },
});
