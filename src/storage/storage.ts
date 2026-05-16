import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppSettings,
  ExportedLibraryBackup,
  ExportedProjectBackup,
  QRProject,
  QR_TYPES,
  QRType,
} from '../types';
import {designFromTemplate, getTemplateById} from '../data/templates';

export const STORAGE_KEYS = {
  projects: '@qrcanvas:v1:projects',
  settings: '@qrcanvas:v1:settings',
};

const nowIso = () => new Date().toISOString();

export const defaultSettings = (): AppSettings => {
  const now = nowIso();
  return {
    defaultTemplateId: 'minimal-white',
    defaultQrType: 'website',
    defaultExportSize: 'standard',
    showScannabilityWarnings: true,
    confirmBeforeDelete: true,
    createdAt: now,
    updatedAt: now,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const safeString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const safeBoolean = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback;

const safeNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const safeQrType = (value: unknown): QRType =>
  QR_TYPES.includes(value as QRType) ? (value as QRType) : 'website';

const normalizeProject = (value: unknown): QRProject | null => {
  if (!isRecord(value)) {
    return null;
  }

  const qrType = safeQrType(value.qrType);
  const templateId = getTemplateById(safeString(value.templateId)).id;
  const defaultDesign = designFromTemplate(templateId);
  const design = isRecord(value.designSettings) ? value.designSettings : {};
  const payloadData = isRecord(value.payloadData) ? value.payloadData : {};
  const fields = isRecord(payloadData.fields) ? payloadData.fields : {};

  const id = safeString(value.id);
  const payload = safeString(value.payload);
  if (!id || !payload) {
    return null;
  }

  return {
    id,
    title: safeString(value.title, 'Untitled QR'),
    subtitle: safeString(value.subtitle),
    footerNote: safeString(value.footerNote),
    qrType,
    payload,
    payloadData: {
      type: safeQrType(payloadData.type),
      fields: fields as QRProject['payloadData']['fields'],
      displaySummary: safeString(payloadData.displaySummary, payload.slice(0, 80)),
      validationStatus:
        payloadData.validationStatus === 'warning' || payloadData.validationStatus === 'error'
          ? payloadData.validationStatus
          : 'valid',
    },
    templateId,
    designSettings: {
      ...defaultDesign,
      foregroundColor: safeString(design.foregroundColor, defaultDesign.foregroundColor),
      backgroundColor: safeString(design.backgroundColor, defaultDesign.backgroundColor),
      cardBackground: safeString(design.cardBackground, defaultDesign.cardBackground),
      titleColor: safeString(design.titleColor, defaultDesign.titleColor),
      subtitleColor: safeString(design.subtitleColor, defaultDesign.subtitleColor),
      footerColor: safeString(design.footerColor, defaultDesign.footerColor),
      borderRadius: safeNumber(design.borderRadius, defaultDesign.borderRadius),
      cardPadding: safeNumber(design.cardPadding, defaultDesign.cardPadding),
      qrSize: safeNumber(design.qrSize, defaultDesign.qrSize),
      showTitle: safeBoolean(design.showTitle, true),
      showSubtitle: safeBoolean(design.showSubtitle, true),
      showFooter: safeBoolean(design.showFooter, true),
      centerBadgeType:
        design.centerBadgeType === 'initials' || design.centerBadgeType === 'icon'
          ? design.centerBadgeType
          : 'none',
      centerBadgeText: safeString(design.centerBadgeText),
      templateId,
    },
    createdAt: safeString(value.createdAt, nowIso()),
    updatedAt: safeString(value.updatedAt, nowIso()),
    lastExportedAt: safeString(value.lastExportedAt) || undefined,
    favorite: safeBoolean(value.favorite, false),
  };
};

export const loadProjects = async (): Promise<QRProject[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.projects);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(normalizeProject).filter(Boolean) as QRProject[];
  } catch {
    return [];
  }
};

export const saveProjects = async (projects: QRProject[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
};

export const loadSettings = async (): Promise<AppSettings> => {
  const defaults = defaultSettings();
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
  if (!raw) {
    return defaults;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return defaults;
    }
    return {
      ...defaults,
      defaultTemplateId: getTemplateById(safeString(parsed.defaultTemplateId, defaults.defaultTemplateId)).id,
      defaultQrType: safeQrType(parsed.defaultQrType),
      defaultExportSize:
        parsed.defaultExportSize === 'large' ||
        parsed.defaultExportSize === 'square' ||
        parsed.defaultExportSize === 'poster'
          ? parsed.defaultExportSize
          : 'standard',
      showScannabilityWarnings: safeBoolean(parsed.showScannabilityWarnings, true),
      confirmBeforeDelete: safeBoolean(parsed.confirmBeforeDelete, true),
      createdAt: safeString(parsed.createdAt, defaults.createdAt),
      updatedAt: safeString(parsed.updatedAt, defaults.updatedAt),
    };
  } catch {
    return defaults;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.settings,
    JSON.stringify({...settings, updatedAt: nowIso()}),
  );
};

export const resetQrcanvasStorage = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_KEYS.projects),
    AsyncStorage.removeItem(STORAGE_KEYS.settings),
  ]);
};

export const exportProjectAsJson = (project: QRProject): string => {
  const backup: ExportedProjectBackup = {
    appName: 'QRCanvas',
    backupVersion: 1,
    generatedAt: nowIso(),
    project,
  };
  return JSON.stringify(backup, null, 2);
};

export const exportLibraryAsJson = (projects: QRProject[], settings: AppSettings): string => {
  const backup: ExportedLibraryBackup = {
    appName: 'QRCanvas',
    backupVersion: 1,
    generatedAt: nowIso(),
    projects,
    settings,
  };
  return JSON.stringify(backup, null, 2);
};

export const importProjectFromJson = (json: string): QRProject[] => {
  const parsed = JSON.parse(json);
  const imported: QRProject[] = [];
  if (isRecord(parsed) && parsed.appName === 'QRCanvas' && isRecord(parsed.project)) {
    const project = normalizeProject(parsed.project);
    if (project) {
      imported.push({...project, id: `${project.id}-${Date.now()}`, updatedAt: nowIso()});
    }
  }
  if (isRecord(parsed) && parsed.appName === 'QRCanvas' && Array.isArray(parsed.projects)) {
    parsed.projects.forEach(item => {
      const project = normalizeProject(item);
      if (project) {
        imported.push({...project, id: `${project.id}-${Date.now()}-${imported.length}`, updatedAt: nowIso()});
      }
    });
  }
  if (Array.isArray(parsed)) {
    parsed.forEach(item => {
      const project = normalizeProject(item);
      if (project) {
        imported.push({...project, id: `${project.id}-${Date.now()}-${imported.length}`, updatedAt: nowIso()});
      }
    });
  }
  if (!imported.length) {
    throw new Error('No valid QRCanvas projects were found in this JSON.');
  }
  return imported;
};
