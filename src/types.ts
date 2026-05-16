export const QR_TYPES = [
  'website',
  'text',
  'contact',
  'wifi',
  'email',
  'phone',
  'sms',
  'calendar',
  'location',
  'social',
  'custom',
] as const;

export type QRType = (typeof QR_TYPES)[number];

export type ValidationStatus = 'valid' | 'warning' | 'error';

export type ExportSize = 'standard' | 'large' | 'square' | 'poster';

export type CenterBadgeType = 'none' | 'initials' | 'icon';

export type QRPayloadData = {
  type: QRType;
  fields: Record<string, string | boolean | null | undefined>;
  displaySummary: string;
  validationStatus: ValidationStatus;
};

export type DesignSettings = {
  foregroundColor: string;
  backgroundColor: string;
  cardBackground: string;
  titleColor: string;
  subtitleColor: string;
  footerColor: string;
  borderRadius: number;
  cardPadding: number;
  qrSize: number;
  showTitle: boolean;
  showSubtitle: boolean;
  showFooter: boolean;
  centerBadgeType: CenterBadgeType;
  centerBadgeText: string;
  templateId: string;
};

export type QRProject = {
  id: string;
  title: string;
  subtitle?: string;
  footerNote?: string;
  qrType: QRType;
  payload: string;
  payloadData: QRPayloadData;
  templateId: string;
  designSettings: DesignSettings;
  createdAt: string;
  updatedAt: string;
  lastExportedAt?: string;
  favorite?: boolean;
};

export type Template = {
  id: string;
  name: string;
  description: string;
  recommendedTypes: QRType[];
  colors: {
    cardBackground: string;
    foreground: string;
    background: string;
    title: string;
    subtitle: string;
    footer: string;
    accent: string;
  };
  layout: {
    padding: number;
    borderRadius: number;
    shadow: boolean;
    qrSize: number;
    alignment: 'left' | 'center';
  };
  previewStyle: 'light' | 'dark' | 'warm' | 'color';
  isPremiumStyle: boolean;
};

export type AppSettings = {
  defaultTemplateId: string;
  defaultQrType: QRType;
  defaultExportSize: ExportSize;
  showScannabilityWarnings: boolean;
  confirmBeforeDelete: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ValidationResult = {
  status: ValidationStatus;
  errors: string[];
  warnings: string[];
  normalizedFields: Record<string, string | boolean | null | undefined>;
  payload?: string;
  displaySummary?: string;
};

export type ScannabilityResult = {
  canRender: boolean;
  errors: string[];
  warnings: string[];
  contrastRatio: number;
};

export type CreateProjectInput = {
  title: string;
  subtitle?: string;
  footerNote?: string;
  qrType: QRType;
  payload: string;
  payloadData: QRPayloadData;
  templateId: string;
  designSettings: DesignSettings;
};

export type ExportedProjectBackup = {
  appName: 'QRCanvas';
  backupVersion: 1;
  generatedAt: string;
  project: QRProject;
};

export type ExportedLibraryBackup = {
  appName: 'QRCanvas';
  backupVersion: 1;
  generatedAt: string;
  projects: QRProject[];
  settings: AppSettings;
};
