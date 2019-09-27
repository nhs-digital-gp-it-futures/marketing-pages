import fs from 'fs';

export class ManifestProvider {
  getDashboardManifest() {
    this.dashboardManifestRaw = fs.readFileSync('./app/forms/dashboard-manifest.json');

    this.dashboardManifest = JSON.parse(this.dashboardManifestRaw);

    return this.dashboardManifest;
  }

  getTaskManifest(taskName) {
    this.taskManifestRaw = fs.readFileSync(`./app/forms/sections/${taskName}.json`);

    this.taskManifest = JSON.parse(this.taskManifestRaw);

    return this.taskManifest;
  }
}
