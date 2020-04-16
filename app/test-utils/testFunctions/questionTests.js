import { runRadioButtonTests } from './questionTests/radioButtonTests';
import { runtextAreaTests } from './questionTests/textAreaTests';
import { runtextAreaNoCountTests } from './questionTests/textAreaNoCountTests'
import { runCheckboxTests } from './questionTests/checkboxTests';
import { runTextFieldTests } from './questionTests/textFieldTests';
import { runBulletpointListTests } from './questionTests/bulletpointListTests';
import { runErrorTests } from './questionTests/errorTests';
import { runComboboxTests } from './questionTests/comboboxTests';

export const runQuestionTests = async ({
  pageSetup,
  sectionManifest,
  data,
  sectionId,
  sectionParent,
  dashboardId,
  errorPostBodyData,
}) => {
  Promise.all([Object.keys(sectionManifest.questions).map(async (questionId) => {
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
    } else if (questionType === 'textarea-field-no-count') {
      runtextAreaNoCountTests({
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
      runQuestionTests({
        pageSetup,
        sectionManifest: sectionManifest.questions[questionId],
        data,
        sectionId,
        sectionParent: questionId,
        errorPostBodyData,
      });
    } else if (questionType === 'combobox-options') {
      runComboboxTests({
        pageSetup,
        sectionManifest,
        questionId,
        data,
      });
    } else {
      throw new Error('TODO: add missing question type to tests');
    }
    if (questionData.errorResponse) {
      runErrorTests({
        pageSetup,
        sectionManifest,
        questionId,
        questionData,
        sectionId,
        sectionParent,
        dashboardId,
        errorPostBodyData,
      });
    }
  })]);
};
