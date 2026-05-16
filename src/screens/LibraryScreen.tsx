import React, {useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Screen} from '../components/Screen';
import {FormField} from '../components/FormField';
import {Chip} from '../components/Chip';
import {EmptyState} from '../components/EmptyState';
import {ProjectCard} from '../components/ProjectCard';
import {PrimaryButton} from '../components/PrimaryButton';
import {useAppState} from '../context/AppState';
import {theme} from '../data/theme';
import {QR_TYPES, QRType} from '../types';
import {getQrTypeLabel} from '../utils/qr';

type SortMode = 'newest' | 'oldest' | 'name' | 'type';

const SORT_OPTIONS: SortMode[] = ['newest', 'oldest', 'name', 'type'];

const sortLabel = (mode: SortMode): string => {
  if (mode === 'newest') {
    return 'Newest';
  }
  if (mode === 'oldest') {
    return 'Oldest';
  }
  if (mode === 'name') {
    return 'Name';
  }
  return 'Type';
};

export const LibraryScreen = () => {
  const navigation = useNavigation<any>();
  const {
    projects,
    storageError,
    reload,
    duplicateExistingProject,
    deleteExistingProject,
    settings,
  } = useAppState();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | QRType>('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  const filteredProjects = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = projects.filter(project => {
      const matchesType = filter === 'all' || project.qrType === filter;
      const haystack = `${project.title} ${project.subtitle ?? ''} ${project.footerNote ?? ''} ${project.payloadData.displaySummary}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      return matchesType && matchesSearch;
    });
    return filtered.sort((a, b) => {
      if (sortMode === 'oldest') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      if (sortMode === 'name') {
        return a.title.localeCompare(b.title);
      }
      if (sortMode === 'type') {
        return a.qrType.localeCompare(b.qrType);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [filter, projects, query, sortMode]);

  const duplicate = async (projectId: string) => {
    const copy = await duplicateExistingProject(projectId);
    if (copy) {
      navigation.navigate('DesignStudio', {projectId: copy.id});
    }
  };

  const confirmDelete = (projectId: string) => {
    const run = () => deleteExistingProject(projectId).catch(error => {
      Alert.alert('Delete failed', error instanceof Error ? error.message : 'The project could not be deleted.');
    });
    if (!settings.confirmBeforeDelete) {
      run();
      return;
    }
    Alert.alert('Delete project?', 'This saved QR design will be removed from local storage.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: run},
    ]);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Saved Library</Text>
        <Text style={styles.title}>Manage local QR designs</Text>
      </View>

      {storageError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not load saved projects.</Text>
          <Text style={styles.errorText}>{storageError}</Text>
          <PrimaryButton title="Retry" onPress={reload} variant="secondary" />
        </View>
      ) : null}

      <View style={styles.panel}>
        <FormField label="Search" value={query} onChangeText={setQuery} placeholder="Search by title, note, or summary" />
        <Text style={styles.controlLabel}>Filter by type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          <Chip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
          {QR_TYPES.map(type => (
            <Chip key={type} label={getQrTypeLabel(type)} selected={filter === type} onPress={() => setFilter(type)} />
          ))}
        </ScrollView>
        <Text style={styles.controlLabel}>Sort</Text>
        <View style={styles.chipRow}>
          {SORT_OPTIONS.map(mode => (
            <Chip key={mode} label={sortLabel(mode)} selected={sortMode === mode} onPress={() => setSortMode(mode)} />
          ))}
        </View>
      </View>

      {filteredProjects.length ? (
        <View style={styles.list}>
          {filteredProjects.map(project => (
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
          title={projects.length ? 'No matching designs' : 'No saved QR designs yet.'}
          message={projects.length ? 'Try a different search, filter, or sort option.' : 'Saved QR projects appear here after you create them.'}
          actionLabel="Create New QR"
          onAction={() => navigation.navigate('Create')}
        />
      )}
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
    gap: 12,
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
  list: {
    gap: 12,
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
});
