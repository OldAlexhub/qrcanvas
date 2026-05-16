import {CreateProjectInput, QRProject} from '../types';

const uuid = (): string => {
  const random = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1);
  return `${random()}${random()}-${random()}-${random()}-${random()}-${random()}${random()}${random()}`;
};

export const createProject = (data: CreateProjectInput): QRProject => {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    title: data.title.trim() || 'Untitled QR',
    subtitle: data.subtitle?.trim(),
    footerNote: data.footerNote?.trim(),
    qrType: data.qrType,
    payload: data.payload,
    payloadData: data.payloadData,
    templateId: data.templateId,
    designSettings: data.designSettings,
    createdAt: now,
    updatedAt: now,
    favorite: false,
  };
};

export const updateProject = (project: QRProject, changes: Partial<QRProject>): QRProject => ({
  ...project,
  ...changes,
  id: project.id,
  createdAt: project.createdAt,
  updatedAt: new Date().toISOString(),
});

export const duplicateProject = (project: QRProject): QRProject => {
  const now = new Date().toISOString();
  return {
    ...project,
    id: uuid(),
    title: `${project.title || 'Untitled QR'} Copy`,
    createdAt: now,
    updatedAt: now,
    lastExportedAt: undefined,
    favorite: false,
  };
};

export const deleteProject = (projects: QRProject[], id: string): QRProject[] =>
  projects.filter(project => project.id !== id);

export const markProjectExported = (project: QRProject): QRProject => ({
  ...project,
  lastExportedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
