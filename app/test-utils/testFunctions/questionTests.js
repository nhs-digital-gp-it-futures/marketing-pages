import { runRadioButtonTests } from './questionTests/radioButtonTests';
import { runtextAreaTests } from './questionTests/textAreaTests';
import { runCheckboxTests } from './questionTests/checkboxTests';
import { runTextFieldTests } from './questionTests/textFieldTests';
import { runBulletpointListTests } from './questionTests/bulletpointListTests';
import { runErrorTests } from './questionTests/errorTests';
import { runComboboxTests } from './questionTests/comboboxTests';

export const runQuestionTests = ({
  pageSetup,
  sectionManifest,
  sectionApiUrl,
  data,
  sectionId,
  apiLocalhost,
  sectionParent,
}) => {
  Object.keys(sectionManifest.questions).forEach(async (questionId) => {
    const questionData = sectionManifest.questions[questionId];
    const questionType = questionData.type;
    if (questionType === 'radiobutton-options') {
      runRadioButtonTests({
        pageSetup,
        sectionManifest,
        questionId,
        data,
      });
    } else if (questionType === 'textarea-field') {
      runtextAreaTests({
        pageSetup,
        sectionManifest,
        questionId,
        data,
      });
    } else if (questionType === 'checkbox-options') {
      runCheckboxTests({
        pageSetup,
        sectionManifest,
        questionId,
        data,
      });
    } else if (questionType === 'text-field') {
      runTextFieldTests({
        pageSetup,
        sectionManifest,
        questionId,
        data,
        sectionParent,
      });
    } else if (questionType === 'bulletpoint-list') {
      runBulletpointListTests({
        pageSetup,
        sectionManifest,
        questionId,
        data,
      });
    } else if (questionType === 'multi-question') {
      Object.keys(sectionManifest.questions).forEach((question) => {
        runQuestionTests({
          pageSetup,
          sectionManifest: sectionManifest.questions[question],
          sectionApiUrl,
          data,
          sectionId,
          apiLocalhost,
          sectionParent: question,
        });
      });
    } else if (questionType === 'combobox-options') {
      runComboboxTests({
        pageSetup,
        sectionManifest,
        questionId,
        data,
      });
    } else {
      console.log('TODO: add missing question type to tests');
      return;
    }
    if (questionData.errorResponse) {
      runErrorTests({
        pageSetup,
        sectionManifest,
        questionId,
        sectionApiUrl,
        questionData,
        sectionId,
        apiLocalhost,
        sectionParent,
      });
    }
  });
};
