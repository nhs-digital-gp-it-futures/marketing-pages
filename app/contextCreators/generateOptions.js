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

const createOptions = (questionId, optionsManifest) => {
  const optionsFromManifest = optionsManifest
      && optionsManifest[questionId]
      && optionsManifest[questionId].options;

  return optionsFromManifest
      && Object.entries(optionsFromManifest).map(([optionId, optionValue]) => ({
        text: optionValue,
        value: optionId,
      }));
};

export const generateOptions = (
  questionId, optionsManifest, formData,
) => {
  if (optionsManifest) {
    const options = createOptions(questionId, optionsManifest);

    const populatedOptions = options && options.map(option => populateQuestionOption(
      questionId, option, formData,
    ));

    return populatedOptions;
  }
  return undefined;
};
