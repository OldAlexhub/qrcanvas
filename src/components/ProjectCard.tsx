import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {getTemplateById} from '../data/templates';
import {theme} from '../data/theme';
import {QRProject} from '../types';
import {getQrTypeLabel} from '../utils/qr';
import {PrimaryButton} from './PrimaryButton';

type Props = {
  project: QRProject;
  onOpen: () => void;
  onExport: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? 'Recently updated' : date.toLocaleDateString();
};

export const ProjectCard = ({project, onOpen, onExport, onDuplicate, onDelete}: Props) => {
  const template = getTemplateById(project.templateId);
  return (
    <Pressable onPress={onOpen} style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.thumb, {backgroundColor: project.designSettings.backgroundColor}]}>
        <QRCode
          value={project.payload || 'QRCanvas'}
          size={74}
          color={project.designSettings.foregroundColor}
          backgroundColor={project.designSettings.backgroundColor}
          quietZone={5}
        />
      </View>
      <View style={styles.body}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {project.title || 'Untitled QR'}
          </Text>
          <Text style={styles.meta} numberOfLines={2}>
            {getQrTypeLabel(project.qrType)} - {template.name} - Updated {formatDate(project.updatedAt)}
          </Text>
        </View>
        <View style={styles.actions}>
          <PrimaryButton title="Open" onPress={onOpen} variant="secondary" style={styles.smallButton} />
          <PrimaryButton title="Export" onPress={onExport} variant="ghost" style={styles.smallButton} />
          <PrimaryButton title="Copy" onPress={onDuplicate} variant="ghost" style={styles.smallButton} />
          <PrimaryButton title="Delete" onPress={onDelete} variant="danger" style={styles.smallButton} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 14,
  },
  pressed: {
    opacity: 0.78,
  },
  thumb: {
    width: 92,
    height: 92,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00000012',
  },
  body: {
    flex: 1,
    gap: 12,
  },
  title: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  meta: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  smallButton: {
    minHeight: 36,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
});
