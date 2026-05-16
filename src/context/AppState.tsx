import React, {createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {AppSettings, CreateProjectInput, QRProject} from '../types';
import {
  defaultSettings,
  importProjectFromJson,
  loadProjects,
  loadSettings,
  resetQrcanvasStorage,
  saveProjects,
  saveSettings,
} from '../storage/storage';
import {
  createProject,
  deleteProject,
  duplicateProject,
  markProjectExported,
  updateProject,
} from '../utils/projects';

type AppStateContextValue = {
  projects: QRProject[];
  settings: AppSettings;
  loading: boolean;
  storageError: string | null;
  reload: () => Promise<void>;
  saveNewProject: (input: CreateProjectInput) => Promise<QRProject>;
  saveExistingProject: (projectId: string, changes: Partial<QRProject>) => Promise<QRProject | null>;
  duplicateExistingProject: (projectId: string) => Promise<QRProject | null>;
  deleteExistingProject: (projectId: string) => Promise<void>;
  recordProjectExport: (projectId: string) => Promise<void>;
  importProjectsFromJsonText: (json: string) => Promise<number>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  resetAllData: () => Promise<void>;
};

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

const sortProjects = (items: QRProject[]): QRProject[] =>
  [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

export const AppStateProvider = ({children}: PropsWithChildren) => {
  const [projects, setProjects] = useState<QRProject[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings());
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  const persistProjects = useCallback(async (nextProjects: QRProject[]) => {
    const sorted = sortProjects(nextProjects);
    setProjects(sorted);
    await saveProjects(sorted);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setStorageError(null);
    try {
      const [loadedProjects, loadedSettings] = await Promise.all([loadProjects(), loadSettings()]);
      setProjects(sortProjects(loadedProjects));
      setSettings(loadedSettings);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Local storage could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveNewProject = useCallback(
    async (input: CreateProjectInput) => {
      const project = createProject(input);
      await persistProjects([project, ...projects]);
      return project;
    },
    [persistProjects, projects],
  );

  const saveExistingProject = useCallback(
    async (projectId: string, changes: Partial<QRProject>) => {
      const current = projects.find(project => project.id === projectId);
      if (!current) {
        return null;
      }
      const nextProject = updateProject(current, changes);
      await persistProjects(projects.map(project => (project.id === projectId ? nextProject : project)));
      return nextProject;
    },
    [persistProjects, projects],
  );

  const duplicateExistingProject = useCallback(
    async (projectId: string) => {
      const current = projects.find(project => project.id === projectId);
      if (!current) {
        return null;
      }
      const copy = duplicateProject(current);
      await persistProjects([copy, ...projects]);
      return copy;
    },
    [persistProjects, projects],
  );

  const deleteExistingProject = useCallback(
    async (projectId: string) => {
      await persistProjects(deleteProject(projects, projectId));
    },
    [persistProjects, projects],
  );

  const recordProjectExport = useCallback(
    async (projectId: string) => {
      const current = projects.find(project => project.id === projectId);
      if (!current) {
        return;
      }
      const exported = markProjectExported(current);
      await persistProjects(projects.map(project => (project.id === projectId ? exported : project)));
    },
    [persistProjects, projects],
  );

  const importProjectsFromJsonText = useCallback(
    async (json: string) => {
      const imported = importProjectFromJson(json);
      await persistProjects([...imported, ...projects]);
      return imported.length;
    },
    [persistProjects, projects],
  );

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      const next = {...settings, ...patch, updatedAt: new Date().toISOString()};
      setSettings(next);
      await saveSettings(next);
    },
    [settings],
  );

  const resetAllData = useCallback(async () => {
    await resetQrcanvasStorage();
    const defaults = defaultSettings();
    setProjects([]);
    setSettings(defaults);
  }, []);

  const value = useMemo(
    () => ({
      projects,
      settings,
      loading,
      storageError,
      reload,
      saveNewProject,
      saveExistingProject,
      duplicateExistingProject,
      deleteExistingProject,
      recordProjectExport,
      importProjectsFromJsonText,
      updateSettings,
      resetAllData,
    }),
    [
      projects,
      settings,
      loading,
      storageError,
      reload,
      saveNewProject,
      saveExistingProject,
      duplicateExistingProject,
      deleteExistingProject,
      recordProjectExport,
      importProjectsFromJsonText,
      updateSettings,
      resetAllData,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = (): AppStateContextValue => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider.');
  }
  return context;
};
