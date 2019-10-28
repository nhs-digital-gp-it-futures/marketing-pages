import { findValidationErrorTypeForQuestion } from '../helpers/findValidationErrorTypeForQuestion';

const populateQuestionsContextWithExistingData = (marketingDataSection) => {
  const questionsContext = {};
  if (marketingDataSection.data) {
    Object.entries(marketingDataSection.data).map(([questionId, questionData]) => {
      if (questionData) {
        questionsContext[questionId] = {
          display: true,
          data: Array.isArray(questionData)
            ? questionData.filter(data => data.length > 0) : questionData,
        };
      }
    });
  }
  return questionsContext;
};

const addIncompleteMandatorySectionsToContext = (
  marketingDataSection, questionsPopulatedWithExistingData, existingSections,
) => {
  const questions = {
    ...questionsPopulatedWithExistingData,
  };

  const updateSections = {
    ...existingSections,
  };

  if (marketingDataSection.requirement === 'Mandatory') {
    if (marketingDataSection.status === 'INCOMPLETE') {
      marketingDataSection.mandatory.map((mandatoryQuestion) => {
        questions[mandatoryQuestion] = {
          display: true,
        };
      });
    }
    updateSections[marketingDataSection.id] = {
      questions,
    };
  }
  return updateSections;
};

const addCompletedOptionalSectionsToContext = (
  marketingDataSection, questionsPopulatedWithExistingData, existingSections,
) => {
  const updatedSections = {
    ...existingSections,
  };

  if (marketingDataSection.requirement === 'Optional' && marketingDataSection.status === 'COMPLETE') {
    updatedSections[marketingDataSection.id] = {
      questions: questionsPopulatedWithExistingData,
    };
  }
  return updatedSections;
};

const addErrorsToApplicableSections = (previewValidationErrors, errorManifest, sections) => {
  const sectionsWithErrors = {
    ...sections,
  };

  const errors = [];

  if (previewValidationErrors) {
    Object.entries(sections).map(([sectionId, sectionData]) => {
      Object.keys(sectionData.questions).map((questionId) => {
        const errorTypeIfApplicable = findValidationErrorTypeForQuestion(
          sectionId, questionId, previewValidationErrors,
        );

        if (errorTypeIfApplicable) {
          const errorMessage = errorManifest[sectionId][questionId][errorTypeIfApplicable];
          sectionsWithErrors[sectionId].questions[questionId].errorMessage = errorMessage;

          const errorSummary = {};
          errorSummary.text = errorMessage;
          errorSummary.href = `#${questionId}`;
          errors.push(errorSummary);
        }
      });
    });
  }

  return {
    sectionsWithErrors,
    errors: errors.length > 0 ? errors : undefined,
  };
};

export const createPreviewPageContext = (
  solutionId, existingMarketingData, previewValidationErrors, errorManifest,
) => {
  const sectionsContext = existingMarketingData.sections.reduce(
    (sectionsAcc, marketingDataSection) => {
      const questionsPopulatedWithExistingData = populateQuestionsContextWithExistingData(
        marketingDataSection,
      );

      const incompleteMandatorySectionsAdded = addIncompleteMandatorySectionsToContext(
        marketingDataSection, questionsPopulatedWithExistingData, sectionsAcc,
      );

      const completedOptionalSectionsAdded = addCompletedOptionalSectionsToContext(
        marketingDataSection, questionsPopulatedWithExistingData, incompleteMandatorySectionsAdded,
      );

      return completedOptionalSectionsAdded;
    }, {},
  );

  const { sectionsWithErrors: sections, errors } = addErrorsToApplicableSections(
    previewValidationErrors, errorManifest, sectionsContext,
  );

  const context = {
    submitPreviewUrl: `/${solutionId}/submitPreview`,
    errors,
    sections,
  };

  return context;
};
