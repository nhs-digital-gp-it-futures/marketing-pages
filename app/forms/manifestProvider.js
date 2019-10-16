import fs from 'fs';

export class ManifestProvider {
  getDashboardManifest() {
    this.dashboardManifestRaw = fs.readFileSync('./app/forms/dashboard-manifest.json');

    this.dashboardManifest = JSON.parse(this.dashboardManifestRaw);

    return this.dashboardManifest;
  }

  getSectionManifest(sectionName) {
    this.sectionManifestRaw = fs.readFileSync(`./app/forms/sections/${sectionName}.json`);

    this.sectionManifest = JSON.parse(this.sectionManifestRaw);

    return this.sectionManifest;
  }

  getPreviewManifest() {
    const previewManifest = [];

    const dashboardManifest = this.getDashboardManifest();

    dashboardManifest.sectionGroups.map((sectionGroup) => {
      sectionGroup.sections.map((section) => {
        const sectionManifest = this.getSectionManifest(section.id);
        previewManifest.push(sectionManifest);
      });
    });

    return previewManifest;
  }
}
