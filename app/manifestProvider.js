import fs from 'fs';

const path = require('path');

export class ManifestProvider {
  getDashboardManifest({ userContextType }) {
    this.dashboardManifestRaw = fs.readFileSync(path.join(__dirname, `/pages/${userContextType}/dashboard/manifest.json`));
    this.dashboardManifest = JSON.parse(this.dashboardManifestRaw);
    return this.dashboardManifest;
  }

  getSubDashboardManifest({ dashboardId }) {
    this.subDashboardManifestRaw = fs.readFileSync(path.join(__dirname, `/pages/supplier/dashboard/subDashboards/${dashboardId}/manifest.json`));
    this.subDashboardManifest = JSON.parse(this.subDashboardManifestRaw);
    return this.subDashboardManifest;
  }

  getSectionManifest({ dashboardId, sectionId, userContextType }) {
    const pathToSectionManifest = dashboardId ? `${dashboardId}/${sectionId}` : `${sectionId}`;
    this.sectionManifestRaw = fs.readFileSync(path.join(__dirname, `/pages/${userContextType}/section/sections/${pathToSectionManifest}/manifest.json`));
    this.sectionManifest = JSON.parse(this.sectionManifestRaw);
    return this.sectionManifest;
  }
}
