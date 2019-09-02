export const getMarketingPageDashboardContext = async () => {
  const context = {
    section: {
      id: 'about-your-solution',
      name: 'About your Solution',
      task: [
        {
          URL: 'features',
          title: 'Features',
          requirement: 'Optional',
          status: 'complete',
        },
      ],
    },
  };
  return context;
};
