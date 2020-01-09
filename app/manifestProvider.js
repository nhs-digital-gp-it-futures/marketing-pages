import fs from 'fs';

export class ManifestProvider {
  getDashboardManifest() {
    this.dashboardManifestRaw = fs.readFileSync('./app/pages/dashboard/manifest.json');
    this.dashboardManifest = JSON.parse(this.dashboardManifestRaw);
    return this.dashboardManifest;
  }

  getSubDashboardManifest({ dashboardId }) {
    this.subDashboardManifestRaw = fs.readFileSync(`./app/pages/dashboard/subDashboards/${dashboardId}/manifest.json`);
    this.subDashboardManifest = JSON.parse(this.subDashboardManifestRaw);
    return this.subDashboardManifest;
  }

  getSectionManifest({ dashboardId, sectionId }) {
    const pathToSectionManifest = dashboardId ? `${dashboardId}/${sectionId}` : `${sectionId}`;
    this.sectionManifestRaw = fs.readFileSync(`./app/pages/section/sections/${pathToSectionManifest}/manifest.json`);
    this.sectionManifest = JSON.parse(this.sectionManifestRaw);
    return this.sectionManifest;
  }
}
