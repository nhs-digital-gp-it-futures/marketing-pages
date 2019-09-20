export const createMarketingDataIfRequired = (dashboardManifest, exisingMarketingData = {}) => {
  const marketingData = {};
  const tasks = [];

  dashboardManifest.sections.map((section) => {
    section.tasks.map((task) => {
      let marketingDataTask = {};

      const existingMarketingDataForTask = exisingMarketingData.tasks && exisingMarketingData.tasks
        .find(existingTask => existingTask.id === task.id);

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
