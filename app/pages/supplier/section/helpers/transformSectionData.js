const arrayTransformation = (questionValue) => {
  if (!questionValue) {
    return [];
  }

  if (Array.isArray(questionValue)) {
    return questionValue;
  }

  return [questionValue];
};

const emptyValueTransformation = questionValue => (questionValue || null);

const transformationStratergy = {
  'checkbox-options': {
    transform: questionValue => arrayTransformation(questionValue),
  },
  'radiobutton-options': {
    transform: questionValue => emptyValueTransformation(questionValue),
  },
  'textarea-field': {
    transform: questionValue => questionValue.trim(),
  },
  'text-field': {
    transform: questionValue => questionValue.trim(),
  },
  'bulletpoint-list': {
    transform: questionValue => questionValue.map(s => s.trim()),
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
    return transformedSectionData;
  }, sectionData);
