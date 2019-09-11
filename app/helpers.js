export const createInitialMarketingData = (dashboardManifest) => {
  const marketingData = {};
  const tasks = [];

  dashboardManifest.sections.map((section) => {
    section.tasks.map((task) => {
      const marketingDataTask = {};
      marketingDataTask.id = task.id;
      marketingDataTask.data = {};
      marketingDataTask.status = 'INCOMPLETE';

      tasks.push(marketingDataTask);
    });
  });

  marketingData.tasks = tasks;

  return marketingData;
};
