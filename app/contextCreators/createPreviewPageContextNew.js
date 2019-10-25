export const createPreviewPageContextNew = (
  solutionId, existingMarketingData,
) => {
  const context = {
    submitPreviewUrl: `/${solutionId}/submitPreview`,
  };

  const sections = {};

  existingMarketingData.sections.map((marketingDataSection) => {
    const questions = {};

    if (marketingDataSection.data) {
      Object.entries(marketingDataSection.data).map(([questionId, questionData]) => {
        if (questionData) {
          questions[questionId] = {
            display: true,
            data: Array.isArray(questionData)
              ? questionData.filter(data => data.length > 0) : questionData,
          };
        }
      });
    }

    if (marketingDataSection.requirement === 'Mandatory') {
      if (marketingDataSection.status === 'INCOMPLETE') {
        marketingDataSection.mandatory.map((mandatoryQuestion) => {
          questions[mandatoryQuestion] = {
            display: true,
          };
        });
      }
      sections[marketingDataSection.id] = {
        questions,
      };
    }

    if (marketingDataSection.requirement === 'Optional' && marketingDataSection.status === 'COMPLETE') {
      sections[marketingDataSection.id] = {
        questions,
      };
    }
  });

  context.sections = sections;

  return context;
};
