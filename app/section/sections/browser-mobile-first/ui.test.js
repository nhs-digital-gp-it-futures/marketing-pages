import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../../../manifestProvider';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const browserMobileFirstMarketingData = {
  'mobile-first-design': 'Yes',
};

const mocks = (responseStatus, responseBody) => {
  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/browser-mobile-first')
    .reply(responseStatus, responseBody);
};

const pageSetup = async (t, responseStatus = 200, responseBody = {}) => {
  mocks(responseStatus, responseBody);
  await t.navigateTo('http://localhost:1234/solution/S100000-001/section/browser-mobile-first');
};

fixture('Show browser mobile first page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the browser mobile first page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Browser based - mobile first');
});

test('should render main advice of section', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Answer the following questions about your browser based Solution');
});

test('should render all the advice of the section', async (t) => {
  await pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest('browser-mobile-first');
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the mobile first design question', async (t) => {
  await pageSetup(t);

  const pluginsRequiredQuestion = Selector('[data-test-id="question-mobile-first-design"]');

  await t
    .expect(pluginsRequiredQuestion.find('.nhsuk-fieldset__legend').innerText).eql('Was this Solution design with a mobile first approach?')
    .expect(pluginsRequiredQuestion.find('.nhsuk-hint').innerText).eql('Please select from the options below.')
    .expect(pluginsRequiredQuestion.find('.nhsuk-radios').count).eql(1)
    .expect(pluginsRequiredQuestion.find('.nhsuk-radios__item').count).eql(2);
});

test('should render the submit button', async (t) => {
  await pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1)
    .expect(submitButton.find('button').innerText).eql('Save and return');
});

test('should goto the browser based dashboard when clicking the submit button', async (t) => {
  await pageSetup(t, 200, browserMobileFirstMarketingData);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/browser-mobile-first')
    .reply(200, browserMobileFirstMarketingData);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/browser-based')
    .reply(200, {});

  const submitButton = Selector('[data-test-id="section-submit-button"] button');
  const getLocation = ClientFunction(() => document.location.href);

  await t
    .expect(submitButton.exists).ok()
    .click(submitButton)
    .expect(getLocation()).contains('/solution/S100000-001/dashboard/browser-based');
});

test('should populate the questions with existing data', async (t) => {
  pageSetup(t, 200, browserMobileFirstMarketingData);

  const pluginsRequiredQuestion = Selector('[data-test-id="question-mobile-first-design"]');
  const yesRadiobutton = pluginsRequiredQuestion.find('.nhsuk-radios__item:nth-child(1)');
  const noRadiobutton = pluginsRequiredQuestion.find('.nhsuk-radios__item:nth-child(2)');

  await t
    .expect(yesRadiobutton.find('input:checked').exists).ok()
    .expect(noRadiobutton.find('input:checked').exists).notOk();
});

test('should show error summary and validation for mobile first design question indicating it is mandatory', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/browser-mobile-first')
    .reply(400, {
      required: ['mobile-first-design'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const mobileFirstDesignQuestion = Selector('[data-test-id="question-mobile-first-design"]');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Please select whether or not this solution was designed with a mobile first approach')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#mobile-first-design')

    .expect(mobileFirstDesignQuestion.find('[data-test-id="radiobutton-options-error"]').exists).ok()
    .expect(mobileFirstDesignQuestion.find('.nhsuk-error-message').innerText).eql('Error:\nPlease select whether or not this solution was designed with a mobile first approach');
});

test('should goto anchor when clicking the mobile first design summary error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/browser-mobile-first')
    .reply(400, {
      required: ['mobile-first-design'],
    });

  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click(submitButton.find('button'))
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/S100000-001/section/browser-mobile-first#mobile-first-design');
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

  const link = Selector('[data-test-id="section-back-link"] a');

  await t
    .click(link)
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('/solution/S100000-001');
});
