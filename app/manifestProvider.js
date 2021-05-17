import fs from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';

export const getDashboardManifest = ({ userContextType }) => {
  const dashboardManifestRaw = fs.readFileSync(path.join(__dirname, `/pages/${userContextType}/dashboard/manifest.json`));
  return JSON.parse(dashboardManifestRaw);
};

export const getSubDashboardManifest = ({ dashboardId }) => {
  const subDashboardManifestRaw = fs.readFileSync(path.join(__dirname, `/pages/supplier/dashboard/subDashboards/${sanitize(dashboardId)}/manifest.json`));
  return JSON.parse(subDashboardManifestRaw);
};

export const getSectionManifest = ({ dashboardId, sectionId, userContextType }) => {
  const sanitizedSectionId = sanitize(sectionId);

  const pathToSectionManifest = dashboardId ? `${sanitize(dashboardId)}/${sanitizedSectionId}` : `${sanitizedSectionId}`;
  const sectionManifestRaw = fs.readFileSync(path.join(__dirname, `/pages/${userContextType}/section/sections/${pathToSectionManifest}/manifest.json`));
  return JSON.parse(sectionManifestRaw);
};
