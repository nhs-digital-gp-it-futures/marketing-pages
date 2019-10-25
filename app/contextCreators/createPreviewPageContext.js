import { findValidationErrorTypeForQuestion } from '../helpers/findValidationErrorTypeForQuestion';

export const createPreviewPageContext = (
  solutionId, existingMarketingData, previewValidationErrors, errorManifest,
) => {
  const context = {
    submitPreviewUrl: `/${solutionId}/submitPreview`,
  };

  const sections = {};
  const errors = [];

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

  if (previewValidationErrors) {
    Object.entries(sections).map(([sectionId, sectionData]) => {
      Object.keys(sectionData.questions).map((questionId) => {
        const errorTypeIfApplicable = findValidationErrorTypeForQuestion(
          sectionId, questionId, previewValidationErrors,
        );

        if (errorTypeIfApplicable) {
          const errorMessage = errorManifest[sectionId][questionId][errorTypeIfApplicable];
          sections[sectionId].questions[questionId].errorMessage = errorMessage;

          const errorSummary = {};
          errorSummary.text = errorMessage;
          errorSummary.href = `#${questionId}`;
          errors.push(errorSummary);
        }
      });
    });
  }

  context.errors = errors.length > 0 ? errors : undefined;
  context.sections = sections;

  return context;
};
