import React from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Screen} from '../components/Screen';
import {PrimaryButton} from '../components/PrimaryButton';
import {EmptyState} from '../components/EmptyState';
import {ProjectCard} from '../components/ProjectCard';
import {TemplateCard} from '../components/TemplateCard';
import {Chip} from '../components/Chip';
import {templates} from '../data/templates';
import {theme} from '../data/theme';
import {useAppState} from '../context/AppState';
import {QRType} from '../types';
import {getQrTypeLabel} from '../utils/qr';

const QUICK_TYPES: QRType[] = ['website', 'wifi', 'contact', 'calendar', 'social', 'text'];

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const {
    projects,
    storageError,
    reload,
    duplicateExistingProject,
    deleteExistingProject,
    settings,
  } = useAppState();
  const recent = projects.slice(0, 3);

  const confirmDelete = (projectId: string) => {
    const run = () => deleteExistingProject(projectId).catch(error => {
      Alert.alert('Delete failed', error instanceof Error ? error.message : 'The project could not be deleted.');
    });
    if (!settings.confirmBeforeDelete) {
      run();
      return;
    }
    Alert.alert('Delete project?', 'This removes the saved QR design from this device.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: run},
    ]);
  };

  const duplicate = async (projectId: string) => {
    const copy = await duplicateExistingProject(projectId);
    if (copy) {
      navigation.navigate('DesignStudio', {projectId: copy.id});
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.brand}>QRCanvas</Text>
        <Text style={styles.tagline}>Design beautiful QR codes offline.</Text>
        <PrimaryButton title="Create New QR" onPress={() => navigation.navigate('Create')} />
      </View>

      {storageError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Local projects could not be loaded.</Text>
          <Text style={styles.errorText}>{storageError}</Text>
          <PrimaryButton title="Retry" onPress={reload} variant="secondary" />
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick payloads</Text>
      </View>
      <View style={styles.quickGrid}>
        {QUICK_TYPES.map(type => (
          <Chip
            key={type}
            label={getQrTypeLabel(type)}
            onPress={() => navigation.navigate('Create', {qrType: type})}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent projects</Text>
        {projects.length ? (
          <Text style={styles.link} onPress={() => navigation.navigate('Library')}>
            View all
          </Text>
        ) : null}
      </View>
      {recent.length ? (
        <View style={styles.list}>
          {recent.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => navigation.navigate('DesignStudio', {projectId: project.id})}
              onExport={() => navigation.navigate('ExportPreview', {projectId: project.id})}
              onDuplicate={() => duplicate(project.id)}
              onDelete={() => confirmDelete(project.id)}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          title="No saved designs yet"
          message="Create your first QR design. No account or internet needed."
          actionLabel="Create QR"
          onAction={() => navigation.navigate('Create')}
        />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Template highlights</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateRow}>
        {templates.slice(0, 8).map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onPress={() => navigation.navigate('Create', {templateId: template.id})}
          />
        ))}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.colors.dark,
    borderRadius: 24,
    padding: 22,
    gap: 12,
    overflow: 'hidden',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 0,
  },
  tagline: {
    color: theme.colors.darkMuted,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FFF4F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1B7AE',
    padding: 16,
    gap: 10,
  },
  errorTitle: {
    color: theme.colors.danger,
    fontSize: 16,
    fontWeight: '900',
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  list: {
    gap: 12,
  },
  templateRow: {
    gap: 12,
    paddingRight: 24,
  },
});
