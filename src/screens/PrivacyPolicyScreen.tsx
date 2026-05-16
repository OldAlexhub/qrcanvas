import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Screen} from '../components/Screen';
import {theme} from '../data/theme';

const sections = [
  {
    title: 'Data collection',
    body: 'QRCanvas does not collect personal data. The app does not use accounts, analytics, ads, tracking, or a backend service.',
  },
  {
    title: 'Local storage',
    body: 'QR content, saved projects, templates, and settings are stored locally on the user device. This data remains on the device unless the user exports or shares it.',
  },
  {
    title: 'Internet usage',
    body: 'QRCanvas is designed to work offline and does not require an internet connection for creating, saving, editing, exporting, or deleting QR codes.',
  },
  {
    title: 'Permissions',
    body: 'QRCanvas does not require camera, contacts, or location permission. Location QR codes are created from coordinates or map URLs entered manually by the user.',
  },
  {
    title: 'Wi-Fi QR codes',
    body: 'Wi-Fi QR codes may contain network names and passwords entered by the user. That content remains local unless the user exports or shares the QR code or JSON backup.',
  },
  {
    title: 'Children privacy',
    body: 'QRCanvas is a general utility app and does not knowingly collect information from children.',
  },
  {
    title: 'Data deletion',
    body: 'Users can delete individual QR projects or reset all app data from Settings.',
  },
  {
    title: 'Disclaimer',
    body: 'QRCanvas creates QR codes from user-entered information, but every scanner and device may read customized designs differently. Users should test important QR designs before printing or distributing them.',
  },
  {
    title: 'Contact and effective date',
    body: 'Contact: [Add support contact]. Effective date: [Add effective date].',
  },
];

export const PrivacyPolicyScreen = () => (
  <Screen>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>Privacy Policy</Text>
      <Text style={styles.title}>QRCanvas</Text>
      <Text style={styles.subtitle}>Developer: Old Alex Hub</Text>
    </View>
    {sections.map(section => (
      <View key={section.title} style={styles.panel}>
        <Text style={styles.panelTitle}>{section.title}</Text>
        <Text style={styles.body}>{section.body}</Text>
      </View>
    ))}
  </Screen>
);

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.ink,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 16,
    gap: 8,
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  body: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
