import { findExistingMarketingDataForTask } from './findExistingMarketingDataForTask';

export const createMarketingDataIfRequired = (dashboardManifest, exisingSolutionData) => {
  const marketingData = {};
  const sections = [];

  dashboardManifest.sectionGroups.map((sectionGroup) => {
    sectionGroup.sections.map((task) => {
      let marketingDataTask = {};

      const existingMarketingDataForTask = findExistingMarketingDataForTask(exisingSolutionData, task.id);

      if (existingMarketingDataForTask) {
        marketingDataTask = existingMarketingDataForTask;
      } else {
        marketingDataTask.id = task.id;
        marketingDataTask.data = {};
        marketingDataTask.status = 'INCOMPLETE';
      }

      sections.push(marketingDataTask);
    });
  });

  marketingData.sections = sections;

  return marketingData;
};
