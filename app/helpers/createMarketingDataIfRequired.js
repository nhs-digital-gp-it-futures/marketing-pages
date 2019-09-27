import { findExistingMarketingDataForSection } from './findExistingMarketingDataForSection';

export const createMarketingDataIfRequired = (dashboardManifest, exisingSolutionData) => {
  const marketingData = {};
  const sections = [];

  dashboardManifest.sectionGroups.map((sectionGroup) => {
    sectionGroup.sections.map((section) => {
      let marketingDataSection = {};

      const existingMarketingDataForSection = findExistingMarketingDataForSection(exisingSolutionData, section.id);

      if (existingMarketingDataForSection) {
        marketingDataSection = existingMarketingDataForSection;
      } else {
        marketingDataSection.id = section.id;
        marketingDataSection.data = {};
        marketingDataSection.status = 'INCOMPLETE';
      }

      sections.push(marketingDataSection);
    });
  });

  marketingData.sections = sections;

  return marketingData;
};
