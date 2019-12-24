import { Selector, ClientFunction } from 'testcafe';
import nock from 'nock';
import { apiLocalhost, apiPath } from '../../config';

const getLocation = ClientFunction(() => document.location.href);

const goToAnchorFromErrorSummary = ({
  pageSetup,
  sectionId,
  questionId,
  errorType,
  sectionManifest,
  dashboardId,
}) => {
  test(`should go to anchor when clicking the ${questionId} summary error link`, async (t) => {
    await pageSetup({ t });
    const questionType = sectionManifest.questions[questionId].type;
    let modifiedQuestionId = questionId;
    // bulletpoint-list numbers the input fields so it is not just the question id e.g. listing-1
    if (questionType === 'bulletpoint-list') modifiedQuestionId = `${questionId}-1`;
    nock(apiLocalhost)
      .put(`${apiPath}/sections/${sectionId}`)
      .reply(400, {
        [errorType]: [modifiedQuestionId],
      });

    const errorSummary = Selector('[data-test-id="error-summary"]');
    const errorSummaryList = Selector('.nhsuk-error-summary__list');
    const submitButton = Selector('[data-test-id="section-submit-button"]');

    await t
      .expect(errorSummary.exists).notOk()
      .click(submitButton.find('button'))
      .expect(errorSummary.exists).ok()
      .expect(errorSummaryList.find('li:nth-child(1) a').count).eql(1)
      .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql(`#${modifiedQuestionId}`)
      .click(errorSummaryList.find('li:nth-child(1) a'));
    if (dashboardId) {
      await t
        .expect(getLocation()).contains(`/solution/S100000-001/dashboard/${dashboardId}/section/${sectionId}#${modifiedQuestionId}`);
    } else {
      await t
        .expect(getLocation()).contains(`/solution/S100000-001/section/${sectionId}#${modifiedQuestionId}`);
    }
  });
};

const maxLengthErrorTest = ({
  pageSetup,
  sectionManifest,
  questionId,
  errorType,
  sectionId,
}) => {
  if (errorType === 'maxLength') {
    test(`should show error summary and validation for ${questionId} question when it exceeds the maxLength`, async (t) => {
      const questionType = sectionManifest.questions[questionId].type;
      await pageSetup({ t });
      nock(apiLocalhost)
        .put(`${apiPath}/${sectionId}`)
        .reply(400, {
          // bulletpoint-list numbers the input fields so it is not just the question id
          maxLength: [questionType === 'bulletpoint-list' ? `${questionId}-1` : questionId],
        });

      const errorSummary = Selector('[data-test-id="error-summary"]');
      const errorSummaryList = Selector('.nhsuk-error-summary__list');
      const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
      const submitButton = Selector('[data-test-id="section-submit-button"]');
      const expectedErrorMessage = sectionManifest.questions[questionId].errorResponse.maxLength;

      await t
        .expect(errorSummary.exists).notOk()
        .click(submitButton.find('button'))
        .expect(errorSummary.exists).ok()
        .expect(errorSummaryList.find('li').count).eql(1)
        .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql(expectedErrorMessage)
        .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql(`#${questionType === 'bulletpoint-list' ? `${questionId}-1` : questionId}`)
        .expect(renderedQuestion.find('.nhsuk-error-message').innerText).eql(`Error:\n${expectedErrorMessage}`);
      if (questionType === 'textarea-field') {
        await t
          .expect(renderedQuestion.find('.nhsuk-textarea--error').exists).ok();
      }
      if (questionType === 'text-field') {
        await t
          .expect(renderedQuestion.find('.nhsuk-input--error').exists).ok();
      }
    });
  }
};

const mandatoryErrorTest = ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionId,
  errorType,
}) => {
  if (errorType === 'required') {
    test(`should show error summary and validation for ${questionId} question indicating it is mandatory`, async (t) => {
      await pageSetup({ t });
      nock(apiLocalhost)
        .put(`${apiPath}/${sectionId}`)
        .reply(400, {
          required: [questionId],
        });

      const expectedQuestion = sectionManifest.questions[questionId];
      const expectedErrorMessage = expectedQuestion.errorResponse.required;
      const errorSummary = Selector('[data-test-id="error-summary"]');
      const errorSummaryList = Selector('.nhsuk-error-summary__list');
      const renderedQuestion = Selector(`[data-test-id="question-${questionId}"]`);
      const submitButton = Selector('[data-test-id="section-submit-button"]');

      await t
        .expect(errorSummary.exists).notOk()
        .click(submitButton.find('button'))
        .expect(errorSummary.exists).ok()
        .expect(errorSummaryList.find('li').count).eql(1)
        .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql(expectedErrorMessage)
        .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql(`#${questionId}`)
        .expect(renderedQuestion.find(`[data-test-id="${expectedQuestion.type}-error"]`).exists).ok()
        .expect(renderedQuestion.find('.nhsuk-error-message').innerText).eql(`Error:\n${expectedErrorMessage}`);
    });
  }
};

export const runErrorTests = ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionId,
  questionData,
  dashboardId,
}) => {
  Object.keys(questionData.errorResponse).forEach((errorType) => {
    mandatoryErrorTest({
      pageSetup,
      sectionManifest,
      questionId,
      sectionId,
    });
    maxLengthErrorTest({
      pageSetup,
      sectionManifest,
      questionId,
      sectionId,
    });
    goToAnchorFromErrorSummary({
      pageSetup,
      sectionManifest,
      questionId,
      sectionId,
      errorType,
      dashboardId,
    });
  });
};