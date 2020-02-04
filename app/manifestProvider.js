import fs from 'fs';

export class ManifestProvider {
  getDashboardManifest() {
    this.dashboardManifestRaw = fs.readFileSync('./app/pages/supplier/dashboard/manifest.json');
    this.dashboardManifest = JSON.parse(this.dashboardManifestRaw);
    return this.dashboardManifest;
  }

  getAuthorityDashboardManifest() {
    this.dashboardManifestRaw = fs.readFileSync('./app/pages/authority/dashboard/manifest.json');
    this.dashboardManifest = JSON.parse(this.dashboardManifestRaw);
    return this.dashboardManifest;
  }

  getSubDashboardManifest({ dashboardId }) {
    this.subDashboardManifestRaw = fs.readFileSync(`./app/pages/supplier/dashboard/subDashboards/${dashboardId}/manifest.json`);
    this.subDashboardManifest = JSON.parse(this.subDashboardManifestRaw);
    return this.subDashboardManifest;
  }

  getSectionManifest({ dashboardId, sectionId, userContextType }) {
    const pathToSectionManifest = dashboardId ? `${dashboardId}/${sectionId}` : `${sectionId}`;
    this.sectionManifestRaw = fs.readFileSync(`./app/pages/${userContextType}/section/sections/${pathToSectionManifest}/manifest.json`);
    this.sectionManifest = JSON.parse(this.sectionManifestRaw);
    return this.sectionManifest;
  }
}
