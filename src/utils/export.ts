import {RefObject} from 'react';
import {View} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import {ExportSize, QRProject} from '../types';
import {exportLibraryAsJson, exportProjectAsJson} from '../storage/storage';
import {AppSettings} from '../types';

export const EXPORT_DIMENSIONS: Record<ExportSize, {label: string; width: number; height: number}> = {
  standard: {label: 'Standard', width: 1200, height: 1500},
  large: {label: 'Large', width: 1800, height: 2250},
  square: {label: 'Square card', width: 1600, height: 1600},
  poster: {label: 'Poster card', width: 1800, height: 2400},
};

const fileSafeName = (value: string): string =>
  (value || 'QRCanvas')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'QRCanvas';

const withFileScheme = (path: string): string => (path.startsWith('file://') ? path : `file://${path}`);

export const exportViewAsPng = async (
  viewRef: RefObject<View | null>,
  options: {projectTitle: string; exportSize: ExportSize; share?: boolean},
): Promise<string> => {
  if (!viewRef.current) {
    throw new Error('Export preview is not ready yet.');
  }
  const dimensions = EXPORT_DIMENSIONS[options.exportSize];
  const uri = await captureRef(viewRef.current, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
    width: dimensions.width,
    height: dimensions.height,
  });
  if (!uri) {
    throw new Error('PNG export did not return a file.');
  }
  if (options.share !== false) {
    await Share.open({
      title: 'Share QRCanvas PNG',
      url: withFileScheme(uri),
      type: 'image/png',
      filename: `${fileSafeName(options.projectTitle)}.png`,
      failOnCancel: false,
    });
  }
  return uri;
};

export const writeJsonToCache = async (json: string, filename: string): Promise<string> => {
  const path = `${RNFS.CachesDirectoryPath}/${fileSafeName(filename)}.json`;
  await RNFS.writeFile(path, json, 'utf8');
  return path;
};

export const shareProjectJson = async (project: QRProject): Promise<string> => {
  const json = exportProjectAsJson(project);
  const path = await writeJsonToCache(json, `${project.title || 'QRCanvas'}-backup`);
  await Share.open({
    title: 'Share QRCanvas JSON backup',
    url: withFileScheme(path),
    type: 'application/json',
    filename: `${fileSafeName(project.title)}-backup.json`,
    failOnCancel: false,
  });
  return path;
};

export const shareLibraryJson = async (
  projects: QRProject[],
  settings: AppSettings,
): Promise<string> => {
  const json = exportLibraryAsJson(projects, settings);
  const path = await writeJsonToCache(json, 'QRCanvas-library-backup');
  await Share.open({
    title: 'Share QRCanvas library backup',
    url: withFileScheme(path),
    type: 'application/json',
    filename: 'QRCanvas-library-backup.json',
    failOnCancel: false,
  });
  return path;
};
