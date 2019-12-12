import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../../../manifestProvider';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const additionalInformationData = {
  'additional-information': 'The solution additional information'
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/browser-additional-information')
      .reply(200, additionalInformationData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/browser-additional-information')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/S100000-001/section/browser-additional-information');
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
    .expect(title.innerText).eql('Browser based - additional information');
});

test('should render main advice of section', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Answer the following questions about your browser based solution');
});

test('should render all the advice of the section', async (t) => {
  await pageSetup(t);

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql('This information is diplayed on the Marketing page for buyers to view');
});

test('should render the additional information question', async (t) => {
  await pageSetup(t);

  const additionalInformation = Selector('[data-test-id="question-additional-information"]');

  await t
    .expect(additionalInformation.find('label.nhsuk-label').innerText).eql('Do you have any additional browser based information (optional)')
    .expect(additionalInformation.find('span.nhsuk-hint').innerText).eql('Add any additional information or requirement your Solution needs to function')
    .expect(additionalInformation.find('textarea').count).eql(1)
    .expect(additionalInformation.find('[data-test-id="textarea-field-footer"]').innerText).eql('You have 500 characters remaining');
});

test('should populate the text fields with existing data', async (t) => {
  pageSetup(t, true);

  const theQuestions = Selector('form');

  await t
    .expect(theQuestions.find('[data-test-id="question-additional-information"]').find('textarea').value).eql('The solution additional information')
});

test('should render the submit button', async (t) => {
  await pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1);
});

test('should show error summary and validation for questions when they exceed the maxLength', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/browser-additional-information')
    .reply(400, {
      maxLength: ['additional-information'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const additionalInformation = Selector('[data-test-id="question-additional-information"]');
  
  const submitButton = Selector('[data-test-id="section-submit-button"] button');
  
  await t
  .expect(errorSummary.exists).notOk()
  .click(submitButton)
  .expect(errorSummary.exists).ok()
  .expect(errorSummaryList.find('li').count).eql(1)
  .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Additional information is over the character limit')
  .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#additional-information')
  .expect(additionalInformation.find('.nhsuk-textarea--error').exists).ok()
  .expect(additionalInformation.find('.nhsuk-error-message').innerText).eql('Error:\nAdditional information is over the character limit')
});

test('should goto anchor when clicking the additional information required error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/browser-additional-information')
    .reply(400, {
      maxLength: ['additional-information'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const submitButton = Selector('[data-test-id="section-submit-button"] button');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton)
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/S100000-001/section/browser-additional-information#additional-information');
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
    .expect(getLocation()).contains('S100000-001');
});
