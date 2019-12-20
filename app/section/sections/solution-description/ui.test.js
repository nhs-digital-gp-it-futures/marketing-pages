import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../../../manifestProvider';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const solutionDescriptionMarketingData = {
  summary: 'The solution summary',
  description: 'The solution description',
  link: 'The solution link',
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/solution-description')
      .reply(200, solutionDescriptionMarketingData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/solution-description')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/solution/S100000-001/section/solution-description');
};

fixture('Show Solution Description page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the Solution Description page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Solution description');
});

test('should render main advice of section', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add further detail about your Solution to provide the buyer with more information.');
});

test('should render all the advice of the section', async (t) => {
  await pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest({ sectionId: 'solution-description' });
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the solution summary question', async (t) => {
  await pageSetup(t);

  const summaryQuestion = Selector('[data-test-id="question-summary"]');

  await t
    .expect(summaryQuestion.find('label.nhsuk-label').innerText).eql('Summarise your Solution *')
    .expect(summaryQuestion.find('span.nhsuk-hint').innerText).eql('Your text from Stage 1, Solution registration has been automatically inserted but can be edited.')
    .expect(summaryQuestion.find('textarea').count).eql(1)
    .expect(summaryQuestion.find('[data-test-id="textarea-field-footer"]').innerText).eql('You can enter up to 300 characters');
});

test('should render the about your solution question', async (t) => {
  await pageSetup(t);

  const summaryQuestion = Selector('[data-test-id="question-description"]');

  await t
    .expect(summaryQuestion.find('label.nhsuk-label').innerText).eql('Write a description about your Solution')
    .expect(summaryQuestion.find('span.nhsuk-hint').innerText).eql('The description will give the buyer more insight into your Solution and the qualities it can provide.')
    .expect(summaryQuestion.find('textarea').count).eql(1)
    .expect(summaryQuestion.find('[data-test-id="textarea-field-footer"]').innerText).eql('You can enter up to 1000 characters');
});

test('should render the solution link field', async (t) => {
  await pageSetup(t);

  const summaryQuestion = Selector('[data-test-id="question-link"]');

  await t
    .expect(summaryQuestion.find('label.nhsuk-label').innerText).eql('Enter a link to more Solution information')
    .expect(summaryQuestion.find('span.nhsuk-hint').innerText).eql('Buyers will be directed to an external link.')
    .expect(summaryQuestion.find('input').count).eql(1);
});

test('should populate the text fields with existing data', async (t) => {
  pageSetup(t, true);

  const theQuestions = Selector('form');

  await t
    .expect(theQuestions.find('[data-test-id="question-summary"]').find('textarea').value).eql('The solution summary')
    .expect(theQuestions.find('[data-test-id="question-description"]').find('textarea').value).eql('The solution description')
    .expect(theQuestions.find('[data-test-id="question-link"]').find('input').value).eql('The solution link');
});

test('should render the submit button', async (t) => {
  await pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1)
    .expect(submitButton.find('button').innerText).eql('Save and return to all sections');
});

test('should show error summary and validation for questions when they exceed the maxLength', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/solution-description')
    .reply(400, {
      maxLength: ['summary', 'description', 'link'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const solutionSummary = Selector('[data-test-id="question-summary"]');
  const solutionDescription = Selector('[data-test-id="question-description"]');
  const solutionLink = Selector('[data-test-id="question-link"]');

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(3)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Solution Summary is over the character limit')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#summary')
    .expect(errorSummaryList.find('li:nth-child(2)').innerText).eql('Solution Description is over the character limit')
    .expect(errorSummaryList.find('li:nth-child(2) a').getAttribute('href')).eql('#description')
    .expect(errorSummaryList.find('li:nth-child(3)').innerText).eql('Solution Link is over the character limit')
    .expect(errorSummaryList.find('li:nth-child(3) a').getAttribute('href')).eql('#link')
    .expect(solutionSummary.find('.nhsuk-textarea--error').exists).ok()
    .expect(solutionSummary.find('.nhsuk-error-message').innerText).eql('Error:\nSolution Summary is over the character limit')
    .expect(solutionDescription.find('.nhsuk-textarea--error').exists).ok()
    .expect(solutionDescription.find('.nhsuk-error-message').innerText).eql('Error:\nSolution Description is over the character limit')
    .expect(solutionLink.find('.nhsuk-input--error').exists).ok()
    .expect(solutionLink.find('.nhsuk-error-message').innerText).eql('Error:\nSolution Link is over the character limit');
});

test('should goto anchor when clicking the solution summary required summary error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/solution-description')
    .reply(400, {
      required: ['summary'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li:nth-child(1) a').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#summary')
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/solution-description#summary');
});

test('should goto anchor when clicking the solution summary max length summary error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/solution-description')
    .reply(400, {
      maxLength: ['summary'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li:nth-child(1) a').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#summary')
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/solution-description#summary');
});

test('should goto anchor when clicking the description summary error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/solution-description')
    .reply(400, {
      maxLength: ['description'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li:nth-child(1) a').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#description')
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/solution-description#description');
});

test('should goto anchor when clicking the abourt url error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/solution-description')
    .reply(400, {
      maxLength: ['link'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li:nth-child(1) a').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#link')
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/solution-description#link');
});

test('should show error summary and validation for Summary indicating it is mandatory', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/solution-description')
    .reply(400, {
      required: ['summary'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const solutionSummary = Selector('[data-test-id="question-summary"]');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Solution Summary is a mandatory question')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#summary')

    .expect(solutionSummary.find('.nhsuk-textarea--error').exists).ok()
    .expect(solutionSummary.find('.nhsuk-error-message').innerText).eql('Error:\nSolution Summary is a mandatory question');
});

test('should render the return to all sections link', async (t) => {
  await pageSetup(t);

  const link = Selector('[data-test-id="section-back-link"] a');

  await t
    .expect(link.innerText).eql('Return to all sections');
});

test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/dashboard')
    .reply(200, dashboardWithCompleteSections);

  const getLocation = ClientFunction(() => document.location.href);

  const link = Selector('[data-test-id="section-back-link"]');

  await t
    .click(link.find('a'))
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('/solution/S100000-001');
});
