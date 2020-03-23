import { transformCsv } from '../../../authority/section/helpers/transformCsv';

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

const transformationStrategy = {
  'checkbox-options': {
    transform: ({ questionValue }) => arrayTransformation(questionValue),
  },
  'radiobutton-options': {
    transform: ({ questionValue }) => emptyValueTransformation(questionValue),
  },
  'textarea-field': {
    transform: ({ questionValue }) => questionValue.trim(),
  },
  'textarea-field-csv': {
    transform: ({ questionId, questionValue: csv }) => transformCsv({ questionId, csv }),
  },
  'text-field': {
    transform: ({ questionValue }) => questionValue.trim(),
  },
  'bulletpoint-list': {
    transform: ({ questionValue }) => questionValue.map(s => s.trim()),
  },
};

export const transformSectionData = async ({
  sectionManifest, sectionData,
}) => Object.entries(sectionManifest.questions)
  .reduce(async (transformedSectionData, [questionId, questionManifest]) => {
    if (!transformationStrategy[questionManifest.type]) {
      return transformedSectionData;
    }

    const transformedData = await transformationStrategy[questionManifest.type]
      .transform({ questionId, questionValue: sectionData[questionId] });

    return ({
      ...await transformedSectionData,
      [questionId]: transformedData,
    });
  }, sectionData);
