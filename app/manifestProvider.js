import fs from 'fs';
import path from 'path';
import util from 'util';

const readFile = util.promisify(fs.readFile);

export const getDashboardManifest = async ({ userContextType }) => {
  const dashboardManifestRaw = await readFile(path.join(__dirname, `/pages/${userContextType}/dashboard/manifest.json`));
  return JSON.parse(dashboardManifestRaw);
};

export const getSubDashboardManifest = async ({ dashboardId }) => {
  const subDashboardManifestRaw = await readFile(path.join(__dirname, `/pages/supplier/dashboard/subDashboards/${dashboardId}/manifest.json`));
  return JSON.parse(subDashboardManifestRaw);
};

export const getSectionManifest = async ({ dashboardId, sectionId, userContextType }) => {
  const pathToSectionManifest = dashboardId ? `${dashboardId}/${sectionId}` : `${sectionId}`;
  const sectionManifestRaw = await readFile(path.join(__dirname, `/pages/${userContextType}/section/sections/${pathToSectionManifest}/manifest.json`));
  return JSON.parse(sectionManifestRaw);
};
