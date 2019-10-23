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

export const transformSectionData = (sectionId, sectionManifest, sectionData) => {
  if (transformationStratergy[sectionId]) {
    const transformedSectionData = {};

    sectionManifest.questions.map((manifestQuestion) => {
      if (transformationStratergy[sectionId][manifestQuestion.id]) {
        const transformedQuestionValue = transformationStratergy[sectionId][manifestQuestion.id]
          .transform(sectionData[manifestQuestion.id]);
        transformedSectionData[manifestQuestion.id] = transformedQuestionValue;
      } else {
        transformedSectionData[manifestQuestion.id] = sectionData[manifestQuestion.id];
      }
    });

    return transformedSectionData;
  }
  return sectionData;
};