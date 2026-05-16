import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Modal, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Screen} from '../components/Screen';
import {QRDesignCard} from '../components/QRDesignCard';
import {TemplateCard} from '../components/TemplateCard';
import {FormField} from '../components/FormField';
import {PrimaryButton} from '../components/PrimaryButton';
import {Chip} from '../components/Chip';
import {EmptyState} from '../components/EmptyState';
import {designFromTemplate, templates} from '../data/templates';
import {theme} from '../data/theme';
import {useAppState} from '../context/AppState';
import {QRProject, DesignSettings} from '../types';
import {validateScannability} from '../utils/qr';

const COLOR_FIELDS: Array<{key: keyof DesignSettings; label: string}> = [
  {key: 'foregroundColor', label: 'QR foreground'},
  {key: 'backgroundColor', label: 'QR background'},
  {key: 'cardBackground', label: 'Card background'},
  {key: 'titleColor', label: 'Title color'},
  {key: 'subtitleColor', label: 'Subtitle color'},
  {key: 'footerColor', label: 'Footer color'},
];

export const DesignStudioScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {
    projects,
    saveNewProject,
    saveExistingProject,
    duplicateExistingProject,
    settings,
  } = useAppState();
  const existingProject = projects.find(project => project.id === route.params?.projectId);
  const routeDraft = route.params?.draft as QRProject | undefined;
  const [project, setProject] = useState<QRProject | null>(routeDraft ?? existingProject ?? null);
  const [fullPreview, setFullPreview] = useState(false);
  const previewRef = useRef<View>(null);

  useEffect(() => {
    setProject(routeDraft ?? existingProject ?? null);
  }, [existingProject, routeDraft]);

  const scannability = useMemo(
    () => (project ? validateScannability(project.designSettings) : null),
    [project],
  );

  const updateProjectState = (changes: Partial<QRProject>) => {
    setProject(current => (current ? {...current, ...changes, updatedAt: new Date().toISOString()} : current));
  };

  const updateDesign = (changes: Partial<DesignSettings>) => {
    setProject(current =>
      current
        ? {
            ...current,
            designSettings: {...current.designSettings, ...changes},
            updatedAt: new Date().toISOString(),
          }
        : current,
    );
  };

  const saveCurrentProject = async (): Promise<QRProject | null> => {
    if (!project) {
      return null;
    }
    const scan = validateScannability(project.designSettings);
    if (!scan.canRender) {
      Alert.alert('Design needs adjustment', scan.errors.join('\n'));
      return null;
    }
    try {
      if (route.params?.projectId || projects.some(item => item.id === project.id)) {
        const saved = await saveExistingProject(project.id, project);
        if (saved) {
          setProject(saved);
          return saved;
        }
      }
      const saved = await saveNewProject({
        title: project.title,
        subtitle: project.subtitle,
        footerNote: project.footerNote,
        qrType: project.qrType,
        payload: project.payload,
        payloadData: project.payloadData,
        templateId: project.templateId,
        designSettings: project.designSettings,
      });
      setProject(saved);
      navigation.setParams({projectId: saved.id, draft: undefined});
      return saved;
    } catch (error) {
      Alert.alert('Save failed', error instanceof Error ? error.message : 'The project could not be saved.');
      return null;
    }
  };

  const exportProject = async () => {
    const saved = await saveCurrentProject();
    if (saved) {
      navigation.navigate('ExportPreview', {projectId: saved.id});
    }
  };

  const duplicateProject = async () => {
    if (!project) {
      return;
    }
    const saved = await saveCurrentProject();
    if (!saved) {
      return;
    }
    const copy = await duplicateExistingProject(saved.id);
    if (copy) {
      navigation.setParams({projectId: copy.id, draft: undefined});
      setProject(copy);
    }
  };

  const selectTemplate = (templateId: string) => {
    const design = designFromTemplate(templateId);
    setProject(current =>
      current
        ? {
            ...current,
            templateId,
            designSettings: {...design, templateId},
            updatedAt: new Date().toISOString(),
          }
        : current,
    );
  };

  const resetDesign = () => {
    if (!project) {
      return;
    }
    updateDesign(designFromTemplate(project.templateId));
  };

  const goEditContent = () => {
    if (project && projects.some(item => item.id === project.id)) {
      navigation.navigate('MainTabs', {screen: 'Create', params: {editProjectId: project.id}});
    } else if (project) {
      navigation.navigate('MainTabs', {screen: 'Create', params: {qrType: project.qrType}});
    }
  };

  if (!project) {
    return (
      <Screen>
        <EmptyState
          title="Add content first"
          message="Create a QR payload before opening the Design Studio."
          actionLabel="Create QR"
          onAction={() => navigation.navigate('MainTabs', {screen: 'Create'})}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Design Studio</Text>
        <Text style={styles.title}>Style your QR card</Text>
      </View>

      <View style={styles.previewWrap}>
        <QRDesignCard ref={previewRef} project={project} />
      </View>

      {settings.showScannabilityWarnings && scannability ? (
        <View style={[styles.notice, scannability.canRender ? styles.noticeWarning : styles.noticeError]}>
          <Text style={styles.noticeTitle}>
            Contrast {scannability.contrastRatio ? `${scannability.contrastRatio}:1` : 'needs attention'}
          </Text>
          {[...scannability.errors, ...scannability.warnings].length ? (
            [...scannability.errors, ...scannability.warnings].map(message => (
              <Text key={message} style={styles.noticeText}>{message}</Text>
            ))
          ) : (
            <Text style={styles.noticeText}>This design has clear QR foreground and background contrast.</Text>
          )}
        </View>
      ) : null}

      <View style={styles.actionGrid}>
        <PrimaryButton title="Save Project" onPress={saveCurrentProject} />
        <PrimaryButton title="Export PNG" onPress={exportProject} variant="secondary" />
        <PrimaryButton title="Duplicate" onPress={duplicateProject} variant="ghost" />
        <PrimaryButton title="Preview" onPress={() => setFullPreview(true)} variant="ghost" />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Templates</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateRow}>
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              selected={template.id === project.templateId}
              onPress={() => selectTemplate(template.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Text</Text>
        <FormField label="Title" value={project.title} onChangeText={value => updateProjectState({title: value})} />
        <FormField label="Subtitle" value={project.subtitle ?? ''} onChangeText={value => updateProjectState({subtitle: value})} />
        <FormField label="Footer note" value={project.footerNote ?? ''} onChangeText={value => updateProjectState({footerNote: value})} />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Show title</Text>
          <Switch value={project.designSettings.showTitle} onValueChange={value => updateDesign({showTitle: value})} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Show subtitle</Text>
          <Switch value={project.designSettings.showSubtitle} onValueChange={value => updateDesign({showSubtitle: value})} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Show footer</Text>
          <Switch value={project.designSettings.showFooter} onValueChange={value => updateDesign({showFooter: value})} />
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Colors</Text>
        {COLOR_FIELDS.map(field => (
          <FormField
            key={field.key}
            label={field.label}
            value={String(project.designSettings[field.key] ?? '')}
            onChangeText={value => updateDesign({[field.key]: value} as Partial<DesignSettings>)}
            autoCapitalize="characters"
            placeholder="#151A1F"
          />
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Card controls</Text>
        <Text style={styles.controlLabel}>QR size</Text>
        <View style={styles.chipRow}>
          <Chip label="Compact" selected={project.designSettings.qrSize === 208} onPress={() => updateDesign({qrSize: 208})} />
          <Chip label="Standard" selected={project.designSettings.qrSize === 236} onPress={() => updateDesign({qrSize: 236})} />
          <Chip label="Large" selected={project.designSettings.qrSize === 276} onPress={() => updateDesign({qrSize: 276})} />
        </View>
        <Text style={styles.controlLabel}>Corner style</Text>
        <View style={styles.chipRow}>
          <Chip label="Sharp" selected={project.designSettings.borderRadius === 8} onPress={() => updateDesign({borderRadius: 8})} />
          <Chip label="Soft" selected={project.designSettings.borderRadius === 18} onPress={() => updateDesign({borderRadius: 18})} />
          <Chip label="Round" selected={project.designSettings.borderRadius === 26} onPress={() => updateDesign({borderRadius: 26})} />
        </View>
        <Text style={styles.controlLabel}>Center badge</Text>
        <View style={styles.chipRow}>
          <Chip label="None" selected={project.designSettings.centerBadgeType === 'none'} onPress={() => updateDesign({centerBadgeType: 'none'})} />
          <Chip label="Initials" selected={project.designSettings.centerBadgeType === 'initials'} onPress={() => updateDesign({centerBadgeType: 'initials'})} />
          <Chip label="QR" selected={project.designSettings.centerBadgeType === 'icon'} onPress={() => updateDesign({centerBadgeType: 'icon'})} />
        </View>
        {project.designSettings.centerBadgeType !== 'none' ? (
          <FormField
            label="Badge text"
            value={project.designSettings.centerBadgeText}
            onChangeText={value => updateDesign({centerBadgeText: value.slice(0, 4)})}
            helper="Use up to 4 characters."
          />
        ) : null}
      </View>

      <View style={styles.actionGrid}>
        <PrimaryButton title="Edit Content" onPress={goEditContent} variant="secondary" />
        <PrimaryButton title="Reset Design" onPress={resetDesign} variant="ghost" />
      </View>

      <Modal visible={fullPreview} animationType="slide" onRequestClose={() => setFullPreview(false)}>
        <Screen>
          <View style={styles.fullPreview}>
            <QRDesignCard project={project} exportMode />
            <PrimaryButton title="Close Preview" onPress={() => setFullPreview(false)} />
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
  previewWrap: {
    alignItems: 'center',
  },
  actionGrid: {
    gap: 10,
  },
  notice: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  noticeWarning: {
    backgroundColor: '#FFF8E7',
    borderColor: '#E7CB83',
  },
  noticeError: {
    backgroundColor: '#FFF0EE',
    borderColor: '#E7A59C',
  },
  noticeTitle: {
    color: theme.colors.ink,
    fontWeight: '900',
    fontSize: 15,
  },
  noticeText: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
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
  templateRow: {
    gap: 12,
    paddingRight: 24,
  },
  switchRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: theme.colors.ink,
    fontSize: 15,
    fontWeight: '700',
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
  fullPreview: {
    alignItems: 'center',
    gap: 20,
  },
});
