import React, {useState} from 'react';
import {Alert, Modal, ScrollView, StyleSheet, Text, TextInput, View, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Screen} from '../components/Screen';
import {Chip} from '../components/Chip';
import {PrimaryButton} from '../components/PrimaryButton';
import {templates} from '../data/templates';
import {theme} from '../data/theme';
import {useAppState} from '../context/AppState';
import {ExportSize, QR_TYPES} from '../types';
import {getQrTypeLabel} from '../utils/qr';
import {EXPORT_DIMENSIONS, shareLibraryJson} from '../utils/export';

export const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const {
    settings,
    projects,
    updateSettings,
    resetAllData,
    importProjectsFromJsonText,
  } = useAppState();
  const [importModal, setImportModal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [busy, setBusy] = useState(false);

  const exportAll = async () => {
    setBusy(true);
    try {
      await shareLibraryJson(projects, settings);
    } catch (error) {
      Alert.alert('Backup export failed', error instanceof Error ? error.message : 'The local backup could not be exported.');
    } finally {
      setBusy(false);
    }
  };

  const importJson = async () => {
    setBusy(true);
    try {
      const count = await importProjectsFromJsonText(jsonText);
      setJsonText('');
      setImportModal(false);
      Alert.alert('Import complete', `${count} project${count === 1 ? '' : 's'} imported into your local library.`);
    } catch (error) {
      Alert.alert('Import failed', error instanceof Error ? error.message : 'The JSON backup could not be imported.');
    } finally {
      setBusy(false);
    }
  };

  const confirmReset = () => {
    Alert.alert('Reset all QRCanvas data?', 'This deletes saved projects and settings stored by this app on this device.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () =>
          resetAllData().catch(error => {
            Alert.alert('Reset failed', error instanceof Error ? error.message : 'Local data could not be reset.');
          }),
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Settings</Text>
        <Text style={styles.title}>Local preferences</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Appearance preferences</Text>
        <Text style={styles.controlLabel}>Default QR type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {QR_TYPES.map(type => (
            <Chip
              key={type}
              label={getQrTypeLabel(type)}
              selected={settings.defaultQrType === type}
              onPress={() => updateSettings({defaultQrType: type})}
            />
          ))}
        </ScrollView>
        <Text style={styles.controlLabel}>Default template</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {templates.map(template => (
            <Chip
              key={template.id}
              label={template.name}
              selected={settings.defaultTemplateId === template.id}
              onPress={() => updateSettings({defaultTemplateId: template.id})}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Export preferences</Text>
        <View style={styles.chipRow}>
          {(Object.keys(EXPORT_DIMENSIONS) as ExportSize[]).map(size => (
            <Chip
              key={size}
              label={EXPORT_DIMENSIONS[size].label}
              selected={settings.defaultExportSize === size}
              onPress={() => updateSettings({defaultExportSize: size})}
            />
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Privacy</Text>
        <Text style={styles.bodyText}>
          QRCanvas does not collect personal data, does not require a login, and is designed to work offline.
          QR content and saved projects stay in local app storage unless you export or share them.
        </Text>
        <PrimaryButton title="View Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicy')} variant="secondary" />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Data management</Text>
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.switchLabel}>Show scannability warnings</Text>
            <Text style={styles.switchHelper}>Warn when contrast, size, or badge choices may reduce readability.</Text>
          </View>
          <Switch
            value={settings.showScannabilityWarnings}
            onValueChange={value => updateSettings({showScannabilityWarnings: value})}
          />
        </View>
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.switchLabel}>Confirm before delete</Text>
            <Text style={styles.switchHelper}>Ask before removing individual saved designs.</Text>
          </View>
          <Switch
            value={settings.confirmBeforeDelete}
            onValueChange={value => updateSettings({confirmBeforeDelete: value})}
          />
        </View>
        <PrimaryButton title="Export All Projects JSON" onPress={exportAll} disabled={busy || projects.length === 0} variant="secondary" />
        <PrimaryButton title="Import JSON Backup" onPress={() => setImportModal(true)} disabled={busy} variant="ghost" />
        <PrimaryButton title="Reset All Local Data" onPress={confirmReset} variant="danger" />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>About QRCanvas</Text>
        <Text style={styles.bodyText}>Developer: Old Alex Hub</Text>
        <Text style={styles.bodyText}>Version: 1.0.0</Text>
        <Text style={styles.bodyText}>Free app. No subscriptions, no login, no data collection.</Text>
      </View>

      <Modal visible={importModal} animationType="slide" onRequestClose={() => setImportModal(false)}>
        <Screen>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Import Backup</Text>
            <Text style={styles.title}>Paste QRCanvas JSON</Text>
          </View>
          <TextInput
            value={jsonText}
            onChangeText={setJsonText}
            multiline
            placeholder="Paste a QRCanvas JSON backup here"
            placeholderTextColor="#8A98A2"
            style={styles.jsonInput}
            textAlignVertical="top"
          />
          <View style={styles.actions}>
            <PrimaryButton title="Import Projects" onPress={importJson} disabled={busy || !jsonText.trim()} />
            <PrimaryButton title="Cancel" onPress={() => setImportModal(false)} variant="ghost" />
          </View>
        </Screen>
      </Modal>
    </Screen>
  );
};

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
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 16,
    gap: 14,
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  controlLabel: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bodyText: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  switchText: {
    flex: 1,
    gap: 3,
  },
  switchLabel: {
    color: theme.colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  switchHelper: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  jsonInput: {
    minHeight: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 14,
    color: theme.colors.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: 10,
  },
});
