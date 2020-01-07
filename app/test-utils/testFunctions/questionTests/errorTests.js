import { Selector, ClientFunction } from 'testcafe';
import nock from 'nock';
import { apiLocalhost, apiPath } from '../../config';

const getLocation = ClientFunction(() => document.location.href);

const getCommonAttributes = ({
  sectionManifest,
  questionId,
  parentQuestionId,
  errorType,
}) => {
  const expectedQuestion = sectionManifest.questions[questionId];
  const questionType = expectedQuestion.type;
  const questionIdBasedOnType = questionType === 'bulletpoint-list' ? `${questionId}-1` : questionId;
  const questionIdBasedOnParentId = parentQuestionId ? `${parentQuestionId}[${questionIdBasedOnType}]` : questionIdBasedOnType;

  const responseBodyBasedOnType = parentQuestionId
    ? {
      [parentQuestionId]: {
        [questionIdBasedOnType]: errorType,
      },
    }
    : {
      [questionIdBasedOnType]: errorType,
    };

  const renderedQuestionSelector = questionType === 'bulletpoint-list'
    ? `field-error-${questionIdBasedOnParentId}`
    : `question-${questionIdBasedOnParentId}`;

  const expectedErrorMessage = expectedQuestion.errorResponse[errorType];
  const expectedAnchorLink = `#${questionIdBasedOnParentId}`;

  return {
    questionId: questionIdBasedOnParentId,
    questionType,
    responseBody: responseBodyBasedOnType,
    renderedQuestionSelector,
    expectedErrorMessage,
    expectedAnchorLink,
  };
};

const errorTests = ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionId,
  errorType,
  errorPostBody,
  dashboardId,
  parentQuestionId,
}) => {
  const {
    questionId: questionIdToRun,
    questionType,
    renderedQuestionSelector,
    responseBody,
    expectedErrorMessage,
    expectedAnchorLink,
  } = getCommonAttributes({
    sectionManifest,
    questionId,
    parentQuestionId,
    errorType,
  });

  test(`should show error summary and validation for ${questionIdToRun} question indicating it is ${errorType}`, async (t) => {
    await pageSetup({ t });

    await nock(apiLocalhost)
      .put(`${apiPath}/sections/${sectionId}`, errorPostBody)
      .reply(400, responseBody);

    const errorSummary = Selector('[data-test-id="error-summary"]');
    const errorSummaryList = Selector('.nhsuk-error-summary__list');
    const renderedQuestion = Selector(`[data-test-id="${renderedQuestionSelector}"]`);
    const submitButton = Selector('[data-test-id="section-submit-button"]');

    await t
      .expect(errorSummary.exists).notOk()
      .click(submitButton.find('button'))
      .expect(errorSummary.exists).ok()
      .expect(errorSummaryList.find('li').count).eql(1)
      .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql(expectedErrorMessage)
      .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql(`${expectedAnchorLink}`)
      .expect(renderedQuestion.exists).ok()
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

  test(`should go to anchor when clicking the ${questionIdToRun} error link`, async (t) => {
    await pageSetup({ t });

    await nock(apiLocalhost)
      .put(`${apiPath}/sections/${sectionId}`)
      .reply(400, responseBody);

    const errorSummary = Selector('[data-test-id="error-summary"]');
    const errorSummaryList = Selector('.nhsuk-error-summary__list');
    const submitButton = Selector('[data-test-id="section-submit-button"]');

    await t
      .expect(errorSummary.exists).notOk()
      .click(submitButton.find('button'))
      .expect(errorSummary.exists).ok()
      .expect(errorSummaryList.find('li:nth-child(1) a').count).eql(1)
      .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql(expectedAnchorLink)
      .click(errorSummaryList.find('li:nth-child(1) a'));
    if (dashboardId) {
      await t
        .expect(getLocation()).contains(`/solution/S100000-001/dashboard/${dashboardId}/section/${sectionId}${expectedAnchorLink}`);
    } else {
      await t
        .expect(getLocation()).contains(`/solution/S100000-001/section/${sectionId}${expectedAnchorLink}`);
    }
  });
};

export const runErrorTests = async ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionId,
  sectionParent,
  questionData,
  dashboardId,
  errorPostBodyData,
}) => {
  const getErrorPostBody = manifest => Object.keys(manifest.questions).reduce((acc, question) => {
    const questionType = manifest.questions[question].type;
    if (questionType === 'radiobutton-options') acc[question] = null;
    else if (questionType === 'checkbox-options') acc[question] = [];
    else if (questionType === 'bulletpoint-list') acc[question] = new Array(manifest.questions[question].maxItems).fill('');
    else acc[question] = '';
    return acc;
  }, {});

  const errorPostBody = errorPostBodyData || getErrorPostBody(sectionManifest);

  await Promise.all(Object.keys(questionData.errorResponse).map((errorType) => {
    errorTests({
      pageSetup,
      sectionManifest,
      questionId,
      sectionId,
      errorType,
      dashboardId,
      errorPostBody,
      parentQuestionId: sectionParent,
    });
  }));
};
