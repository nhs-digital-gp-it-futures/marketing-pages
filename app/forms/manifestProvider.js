import fs from 'fs';

export class ManifestProvider {
  getDashboardManifest() {
    this.dashboardManifestRaw = fs.readFileSync('./app/forms/dashboard-manifest.json');

    this.dashboardManifest = JSON.parse(this.dashboardManifestRaw);

    return this.dashboardManifest;
  }

  getSubDashboardManifest(sectionName) {
    this.subDashboardManifestRaw = fs.readFileSync(`./app/forms/dashboards/${sectionName}.json`);

    this.subDashboardManifest = JSON.parse(this.subDashboardManifestRaw);

    return this.subDashboardManifest;
  }

  getSectionManifest(sectionName) {
    this.sectionManifestRaw = fs.readFileSync(`./app/forms/sections/${sectionName}.json`);

    this.sectionManifest = JSON.parse(this.sectionManifestRaw);

    return this.sectionManifest;
  }

  getOptionsManifest(sectionName) {
    try {
      this.optionsManifestRaw = fs.readFileSync(`./app/forms/options/${sectionName}.json`);
      return JSON.parse(this.optionsManifestRaw);
    } catch (err) {
      return undefined;
    }
  }
}
