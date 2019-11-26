import { doesFormDataContainValue } from '../helpers/formData';

const populateQuestionOption = (
  questionId, questionOption, formData,
) => {
  const populatedOption = questionOption;

  if (doesFormDataContainValue(questionId, questionOption.value, formData)) {
    return {
      ...questionOption,
      checked: true,
    };
  }

  return populatedOption;
};

const createOptions = options => options
      && Object.entries(options).map(([optionId, optionValue]) => ({
        text: optionValue,
        value: optionId,
      }));

export const generateOptions = (
  questionId, options, formData,
) => {
  if (options) {
    const createdOptions = createOptions(options);

    const populatedOptions = createdOptions && createdOptions.map(option => populateQuestionOption(
      questionId, option, formData,
    ));

    return populatedOptions;
  }
  return undefined;
};
