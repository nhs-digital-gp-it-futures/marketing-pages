import { Selector, ClientFunction } from 'testcafe';
import nock from 'nock';

const getLocation = ClientFunction(() => document.location.href);

const goToAnchorFromErrorSummary = ({
  pageSetup,
  sectionId,
  questionId,
  sectionApiUrl,
  errorType,
  sectionManifest,
  apiLocalhost,
}) => {
  test(`should go to anchor when clicking the ${questionId} summary error link`, async (t) => {
    await pageSetup({ t });
    const questionType = sectionManifest.questions[questionId].type;
    let modifiedQuestionId = questionId;
    // bulletpoint-list numbers the input fields so it is not just the question id e.g. listing-1
    if (questionType === 'bulletpoint-list') modifiedQuestionId = `${questionId}-1`;
    nock(apiLocalhost)
      .put(sectionApiUrl)
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
      .click(errorSummaryList.find('li:nth-child(1) a'))
      .expect(getLocation()).contains(`/solution/S100000-001/section/${sectionId}#${modifiedQuestionId}`);
  });
};

const maxLengthErrorTest = ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionApiUrl,
  apiLocalhost,
}) => {
  test(`should show error summary and validation for ${questionId} question when it exceeds the maxLength`, async (t) => {
    const questionType = sectionManifest.questions[questionId].type;
    await pageSetup({ t });
    nock(apiLocalhost)
      .put(sectionApiUrl)
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
  });
};

const mandatoryErrorTest = ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionApiUrl,
  apiLocalhost,
}) => {
  test(`should show error summary and validation for ${questionId} question indicating it is mandatory`, async (t) => {
    await pageSetup({ t });
    nock(apiLocalhost)
      .put(sectionApiUrl)
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
};

export const runErrorTests = ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionApiUrl,
  questionData,
  sectionId,
  apiLocalhost,
  sectionParent,
}) => {
  Object.keys(questionData.errorResponse).forEach((errorType) => {
    if (errorType === 'required') {
      mandatoryErrorTest({
        pageSetup,
        sectionManifest,
        questionId,
        sectionApiUrl,
        apiLocalhost,
      });
    }
    if (errorType === 'maxLength') {
      maxLengthErrorTest({
        pageSetup,
        sectionManifest,
        questionId,
        sectionApiUrl,
        apiLocalhost,
      });
    }
    goToAnchorFromErrorSummary({
      pageSetup,
      sectionManifest,
      sectionId,
      questionId,
      sectionApiUrl,
      errorType,
      apiLocalhost,
    });
  });
};
