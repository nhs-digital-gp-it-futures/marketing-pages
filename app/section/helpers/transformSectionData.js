const arrayTransformation = (questionValue) => {
  if (!questionValue) {
    return [];
  }

  if (Array.isArray(questionValue)) {
    return questionValue;
  }

  return [questionValue];
};

const transformationStratergy = {
  'client-application-types': {
    'client-application-types': {
      transform: questionValue => arrayTransformation(questionValue),
    },
  },
  'browsers-supported': {
    'supported-browsers': {
      transform: questionValue => arrayTransformation(questionValue),
    },
  },
};

export const transformSectionData = ({
  sectionId, sectionManifest, sectionData,
}) => {
  if (transformationStratergy[sectionId]) {
    const transformedSectionData = {};

    Object.keys(sectionManifest.questions).map((questionId) => {
      if (transformationStratergy[sectionId][questionId]) {
        const transformedQuestionValue = transformationStratergy[sectionId][questionId]
          .transform(sectionData[questionId]);
        transformedSectionData[questionId] = transformedQuestionValue;
      } else {
        transformedSectionData[questionId] = sectionData[questionId];
      }
    });

    return transformedSectionData;
  }
  return sectionData;
};
