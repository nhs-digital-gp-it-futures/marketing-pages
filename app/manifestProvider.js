import fs from 'fs';
import path from 'path';

export const getDashboardManifest = ({ userContextType }) => {
  const dashboardManifestRaw = fs.readFileSync(path.join(__dirname, `/pages/${userContextType}/dashboard/manifest.json`));
  return JSON.parse(dashboardManifestRaw);
};

export const getSubDashboardManifest = ({ dashboardId }) => {
  const subDashboardManifestRaw = fs.readFileSync(path.join(__dirname, `/pages/supplier/dashboard/subDashboards/${dashboardId}/manifest.json`));
  return JSON.parse(subDashboardManifestRaw);
};

export const getSectionManifest = ({ dashboardId, sectionId, userContextType }) => {
  const pathToSectionManifest = dashboardId ? `${dashboardId}/${sectionId}` : `${sectionId}`;
  const sectionManifestRaw = fs.readFileSync(path.join(__dirname, `/pages/${userContextType}/section/sections/${pathToSectionManifest}/manifest.json`));
  return JSON.parse(sectionManifestRaw);
};
