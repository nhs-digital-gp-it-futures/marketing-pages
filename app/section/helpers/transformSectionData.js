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
  'checkbox-options': {
    transform: questionValue => arrayTransformation(questionValue),
  },
};

export const transformSectionData = ({
  sectionManifest, sectionData,
}) => Object.entries(sectionManifest.questions)
  .reduce((transformedSectionData, [questionId, questionManifest]) => {
    if (transformationStratergy[questionManifest.type]) {
      return ({
        ...transformedSectionData,
        [questionId]: transformationStratergy[questionManifest.type]
          .transform(sectionData[questionId]),
      });
    }
    return ({
      ...transformedSectionData,
    });
  }, { ...sectionData });
