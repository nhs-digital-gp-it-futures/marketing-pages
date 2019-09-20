import { findExistingMarketingDataForTask } from '../contextCreators/findExistingMarketingDataForTask';

export const createMarketingDataIfRequired = (dashboardManifest, exisingSolutionData) => {
  const marketingData = {};
  const tasks = [];

  dashboardManifest.sections.map((section) => {
    section.tasks.map((task) => {
      let marketingDataTask = {};

      const existingMarketingDataForTask = findExistingMarketingDataForTask(exisingSolutionData, task.id);

      if (existingMarketingDataForTask) {
        marketingDataTask = existingMarketingDataForTask;
      } else {
        marketingDataTask.id = task.id;
        marketingDataTask.data = {};
        marketingDataTask.status = 'INCOMPLETE';
      }

      tasks.push(marketingDataTask);
    });
  });

  marketingData.tasks = tasks;

  return marketingData;
};
