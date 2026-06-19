import React, {useRef, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Screen} from '../components/Screen';
import {QRDesignCard} from '../components/QRDesignCard';
import {PrimaryButton} from '../components/PrimaryButton';
import {Chip} from '../components/Chip';
import {EmptyState} from '../components/EmptyState';
import {useInterstitialWithCap} from '../ads/useInterstitialWithCap';
import {theme} from '../data/theme';
import {useAppState} from '../context/AppState';
import {ExportSize} from '../types';
import {EXPORT_DIMENSIONS, exportViewAsPng, shareProjectJson} from '../utils/export';

export const ExportPreviewScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {projects, settings, updateSettings, recordProjectExport} = useAppState();
  const project = projects.find(item => item.id === route.params?.projectId);
  const [exportSize, setExportSize] = useState<ExportSize>(settings.defaultExportSize);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<View>(null);
  const {tryShowInterstitial} = useInterstitialWithCap();

  if (!project || !project.payload) {
    return (
      <Screen>
        <EmptyState
          title="Nothing to export"
          message="Open a saved QR project before exporting a PNG or JSON backup."
          actionLabel="Go to Library"
          onAction={() => navigation.navigate('MainTabs', {screen: 'Library'})}
        />
      </Screen>
    );
  }

  const runPngExport = async () => {
    setExporting(true);
    try {
      await updateSettings({defaultExportSize: exportSize});
      await exportViewAsPng(exportRef, {projectTitle: project.title, exportSize});
      await recordProjectExport(project.id);
      Alert.alert('Export ready', 'The PNG was created and opened in the local share flow.');
      tryShowInterstitial();
    } catch (error) {
      Alert.alert('PNG export failed', error instanceof Error ? error.message : 'The image could not be exported.');
    } finally {
      setExporting(false);
    }
  };

  const runJsonExport = async () => {
    setExporting(true);
    try {
      await shareProjectJson(project);
      await recordProjectExport(project.id);
    } catch (error) {
      Alert.alert('JSON export failed', error instanceof Error ? error.message : 'The JSON backup could not be exported.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Export Preview</Text>
        <Text style={styles.title}>{project.title}</Text>
      </View>

      <View style={styles.exportStage}>
        <QRDesignCard ref={exportRef} project={project} exportMode />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Export size</Text>
        <View style={styles.chipRow}>
          {(Object.keys(EXPORT_DIMENSIONS) as ExportSize[]).map(size => (
            <Chip
              key={size}
              label={EXPORT_DIMENSIONS[size].label}
              selected={exportSize === size}
              onPress={() => setExportSize(size)}
            />
          ))}
        </View>
        <Text style={styles.note}>
          PNG export is generated on-device from this preview. JSON backups include project metadata,
          payload, template, design settings, created date, updated date, and generated date.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title={exporting ? 'Exporting...' : 'Export PNG'} onPress={runPngExport} disabled={exporting} />
        <PrimaryButton title="Share PNG" onPress={runPngExport} disabled={exporting} variant="secondary" />
        <PrimaryButton title="Export JSON Backup" onPress={runJsonExport} disabled={exporting} variant="ghost" />
      </View>
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
  exportStage: {
    alignItems: 'center',
    backgroundColor: '#E7ECEF',
    borderRadius: 22,
    padding: 16,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 16,
    gap: 12,
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  note: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  actions: {
    gap: 10,
  },
});
