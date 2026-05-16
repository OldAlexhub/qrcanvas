import {QRProject, QRType} from '../types';

export type MainTabParamList = {
  Home: undefined;
  Create: {qrType?: QRType; templateId?: string; editProjectId?: string} | undefined;
  Library: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  DesignStudio:
    | {
        draft?: QRProject;
        projectId?: string;
        templateId?: string;
      }
    | undefined;
  ExportPreview:
    | {
        projectId: string;
      }
    | undefined;
  PrivacyPolicy: undefined;
};
