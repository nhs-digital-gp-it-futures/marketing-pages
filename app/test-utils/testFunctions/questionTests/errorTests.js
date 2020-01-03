import { Selector, ClientFunction } from 'testcafe';
import nock from 'nock';
import { apiLocalhost, apiPath } from '../../config';

const getLocation = ClientFunction(() => document.location.href);

const goToAnchorFromErrorSummary = async ({
  pageSetup,
  sectionId,
  questionId,
  errorType,
  sectionManifest,
  dashboardId,
  errorPostBody,
  parentQuestionId,
}) => {
  await test(`should go to anchor when clicking the ${questionId} summary error link`, async (t) => {
    await pageSetup({ t });
    const questionType = sectionManifest.questions[questionId].type;

    // bulletpoint-list numbers the input fields so it is not just the question id
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

    nock(apiLocalhost)
    .put(`${apiPath}/sections/${sectionId}`, errorPostBody)
    .reply(400, responseBodyBasedOnType);

    const errorSummary = Selector('[data-test-id="error-summary"]');
    const errorSummaryList = Selector('.nhsuk-error-summary__list');
    const submitButton = Selector('[data-test-id="section-submit-button"]');
    const expectedAnchorLink = `#${questionIdBasedOnParentId}`;

    await t
      .expect(errorSummary.exists).notOk()
      .click(submitButton.find('button'))
      .expect(errorSummaryList.find('li:nth-child(1) a').count).eql(1)
      .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql(expectedAnchorLink)
      .click(errorSummaryList.find('li:nth-child(1) a'));
    if (dashboardId) {
      await t
        .expect(getLocation()).contains(`/solution/S100000-001/dashboard/${dashboardId}/section/${sectionId}#${questionIdBasedOnParentId}`);
    } else {
      await t
        .expect(getLocation()).contains(`/solution/S100000-001/section/${sectionId}${expectedAnchorLink}`);
    }
  });
};

const maxLengthErrorTest = async ({
  pageSetup,
  sectionManifest,
  questionId,
  errorType,
  sectionId,
errorPostBody,  
parentQuestionId,
}) => {
  if (errorType === 'maxLength') {
    await test(`should show error summary and validation for ${questionId} question when it exceeds the maxLength`, async (t) => {
      await pageSetup({ t });
      const questionType = sectionManifest.questions[questionId].type;

      // bulletpoint-list numbers the input fields so it is not just the question id
      const questionIdBasedOnType = questionType === 'bulletpoint-list' ? `${questionId}-1` : questionId;
      const questionIdBasedOnParentId = parentQuestionId ? `${parentQuestionId}[${questionIdBasedOnType}]` : questionIdBasedOnType;
      const responseBodyBasedOnType = parentQuestionId
        ? {
          [parentQuestionId]: {
            [questionIdBasedOnType]: 'maxLength',
          },
        }
        : {
          [questionIdBasedOnType]: 'maxLength',
        };

      nock(apiLocalhost)
        .put(`${apiPath}/sections/${sectionId}`, errorPostBody)
        .reply(400, responseBodyBasedOnType);

      const errorSummary = Selector('[data-test-id="error-summary"]');
      const errorSummaryList = Selector('.nhsuk-error-summary__list');

      const renderedQuestionSelector = questionType === 'bulletpoint-list'
        ? `field-error-${questionIdBasedOnParentId}`
        : `question-${questionIdBasedOnParentId}`;

      const renderedQuestion = Selector(`[data-test-id="${renderedQuestionSelector}"]`);
      const submitButton = Selector('[data-test-id="section-submit-button"]');
      const expectedErrorMessage = sectionManifest.questions[questionId].errorResponse.maxLength;
      const expectedAnchorLink = `#${questionIdBasedOnParentId}`;

      await t
        .expect(errorSummary.exists).notOk()
        .click(submitButton.find('button'))
        .expect(errorSummary.exists).ok()
        .expect(errorSummaryList.find('li').count).eql(1)
        .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql(expectedErrorMessage)
        .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql(expectedAnchorLink)
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

const mandatoryErrorTest = async ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionId,
  errorType,
  errorPostBody,
  parentQuestionId,
}) => {
  if (errorType === 'required') {
    await test(`should show error summary and validation for ${questionId} question indicating it is mandatory`, async (t) => {
      await pageSetup({ t });
      const questionType = sectionManifest.questions[questionId].type;
      const questionIdBasedOnType = questionType === 'bulletpoint-list' ? `${questionId}-1` : questionId;
      const questionIdBasedOnParentId = parentQuestionId ? `${parentQuestionId}[${questionIdBasedOnType}]` : questionIdBasedOnType;
      const renderedQuestionSelector = questionType === 'bulletpoint-list'
        ? `field-error-${questionIdBasedOnParentId}`
        : `question-${questionIdBasedOnParentId}`;
      const responseBodyBasedOnType = parentQuestionId
        ? {
          [parentQuestionId]: {
            [questionIdBasedOnType]: 'required',
          },
        }
        : {
          [questionIdBasedOnType]: 'required',
        };

      nock(apiLocalhost)
        .put(`${apiPath}/sections/${sectionId}`, errorPostBody)
        .reply(400, responseBodyBasedOnType);

      const expectedQuestion = sectionManifest.questions[questionId];
      const expectedErrorMessage = expectedQuestion.errorResponse.required;

      const errorSummary = Selector('[data-test-id="error-summary"]');
      const errorSummaryList = Selector('.nhsuk-error-summary__list');
      const renderedQuestion = Selector(`[data-test-id="${renderedQuestionSelector}"]`);
      const submitButton = Selector('[data-test-id="section-submit-button"]');
      const expectedAnchorLink = `#${questionIdBasedOnParentId}`;

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
  }
};

export const runErrorTests = async ({
  pageSetup,
  sectionManifest,
  questionId,
  sectionId,
  sectionParent,
  questionData,
  dashboardId,
}) => {
  const errorPostBody = Object.keys(sectionManifest.questions).reduce((acc, question) => {
    const questionType = sectionManifest.questions[question].type;
    if (questionType === 'radiobutton-options') acc[question] = null;
    else if (questionType === 'checkbox-options') acc[question] = [];
    else if (questionType === 'bulletpoint-list') acc[question] = new Array(sectionManifest.questions[question].maxItems).fill('');
    else acc[question] = '';
    return acc;
  }, {});

  await Promise.all(Object.keys(questionData.errorResponse).map((errorType) => {
    mandatoryErrorTest({
      pageSetup,
      sectionManifest,
      questionId,
      sectionId,
      errorType,
      errorPostBody,
      parentQuestionId: sectionParent,
    });
    maxLengthErrorTest({
      pageSetup,
      sectionManifest,
      questionId,
      sectionId,
      errorType,
      errorPostBody,
      parentQuestionId: sectionParent,
    });
    goToAnchorFromErrorSummary({
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
