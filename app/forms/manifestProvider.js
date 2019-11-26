import fs from 'fs';

export class ManifestProvider {
  getDashboardManifest() {
    this.dashboardManifestRaw = fs.readFileSync('./app/dashboard/manifest.json');

    this.dashboardManifest = JSON.parse(this.dashboardManifestRaw);

    return this.dashboardManifest;
  }

  getSubDashboardManifest(sectionName) {
    this.subDashboardManifestRaw = fs.readFileSync(`./app/dashboard/subDashboards/${sectionName}/manifest.json`);

    this.subDashboardManifest = JSON.parse(this.subDashboardManifestRaw);

    return this.subDashboardManifest;
  }

  getSectionManifest(sectionName) {
    this.sectionManifestRaw = fs.readFileSync(`./app/forms/sections/${sectionName}.json`);

    this.sectionManifest = JSON.parse(this.sectionManifestRaw);

    return this.sectionManifest;
  }
}
