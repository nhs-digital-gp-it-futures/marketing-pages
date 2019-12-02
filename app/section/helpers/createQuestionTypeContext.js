// eslint-disable-next-line import/no-cycle
import { createContextForMultiQuestion } from './createContextForMultiQuestion';
import { createQuestionsContextForBulletpointList } from './createQuestionsContextForBulletpointList';
import { createQuestionsContextForOptions } from './createQuestionsContextForOptions';
import { createContextForTextInputsQuestion } from './createContextForTextInputsQuestion';

export const createQuestionTypeContext = {
  'bulletpoint-list': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createQuestionsContextForBulletpointList(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'checkbox-options': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createQuestionsContextForOptions(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'radiobutton-options': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createQuestionsContextForOptions(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'textarea-field': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createContextForTextInputsQuestion(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'text-field': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createContextForTextInputsQuestion(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
  'multi-question': {
    create: (
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ) => createContextForMultiQuestion(
      questionId, questionManifest, formData, validationErrors, parentQuestionId,
    ),
  },
};
