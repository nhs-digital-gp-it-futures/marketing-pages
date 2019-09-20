import { getExistingDataIfAvailable } from './getExistingDataIfAvailable';

export const generateFields = (question, exisitingDataForTask) => {
  const fields = [];

  Array(question.maxItems).fill().map((_, i) => {
    const field = {};
    field.id = `${question.id}-${i + 1}`;
    field.data = getExistingDataIfAvailable(exisitingDataForTask, question.id, i);
    fields.push(field);
  });

  return fields;
};
