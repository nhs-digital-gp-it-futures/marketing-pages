import { doesFormDataContainValue } from './formData';

const populateQuestionOption = (
  questionId, questionOption, formData, questionType,
) => {
  const populatedOption = questionOption;

  if (doesFormDataContainValue({ key: questionId, value: questionOption.value, formData })) {
    if (questionType === 'combobox-options') {
      return {
        ...questionOption,
        selected: true,
      };
    }

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
  questionId, options, formData, questionType,
) => {
  if (options) {
    const createdOptions = createOptions(options);

    const populatedOptions = createdOptions && createdOptions.map(option => populateQuestionOption(
      questionId, option, formData, questionType,
    ));

    return populatedOptions;
  }
  return undefined;
};
