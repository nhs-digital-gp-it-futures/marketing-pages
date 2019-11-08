import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../app/forms/manifestProvider';
import dashboardWithCompleteSections from './fixtures/dashboardWithCompleteSections.json';
import aBrowserBasedFixture from './fixtures/aBrowserBasedData.json';

const browserSupportedMarketingData = {
  'supported-browsers': [
    'google-chrome',
    'internet-explorer-10',
  ],
  'mobile-responsive': 'yes',
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/browsers-supported')
      .reply(200, browserSupportedMarketingData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/browsers-supported')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/S100000-001/section/browsers-supported');
};

fixture('Show Browsers Supported page');

test('should render the Browsers Supported page title', async (t) => {
  pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Browser based - browsers supported');
});

test('should render main advice of section', async (t) => {
  pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Answer the following questions about your browser based Solution');
});

test('should render all the advice of the section', async (t) => {
  pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest('browsers-supported');
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the supported browsers question', async (t) => {
  pageSetup(t);

  const supportedBrowsersQuestion = Selector('[data-test-id="question-supported-browsers"]');

  await t
    .expect(supportedBrowsersQuestion.find('.nhsuk-fieldset__legend').innerText).eql('What browsers are supported? Select all that apply*')
    .expect(supportedBrowsersQuestion.find('.nhsuk-hint').innerText).eql('If your Solution is browser based, please select below all the browsers your Solution supports.')
    .expect(supportedBrowsersQuestion.find('.nhsuk-checkboxes').count).eql(1)
    .expect(supportedBrowsersQuestion.find('.nhsuk-checkboxes__item').count).eql(8);
});

test('should render the mobile responsive question', async (t) => {
  pageSetup(t);

  const mobileResponsiveQuestion = Selector('[data-test-id="question-mobile-responsive"]');

  await t
    .expect(mobileResponsiveQuestion.find('.nhsuk-fieldset__legend').innerText).eql('Is your Solution mobile responsive?*')
    .expect(mobileResponsiveQuestion.find('.nhsuk-hint').innerText).eql('Please select below if the design responds and adapts to mobile or tablet devices.')
    .expect(mobileResponsiveQuestion.find('.nhsuk-radios').count).eql(1)
    .expect(mobileResponsiveQuestion.find('.nhsuk-radios__item').count).eql(2);
});

test('should render the submit button', async (t) => {
  pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1);
});

test('should populate the questions with existing data', async (t) => {
  pageSetup(t, true);

  const supportedBrowserQuestion = Selector('[data-test-id="question-supported-browsers"]');
  const googleChromeCheckbox = supportedBrowserQuestion.find('.nhsuk-checkboxes__item:nth-child(1)');
  const edgeCheckbox = supportedBrowserQuestion.find('.nhsuk-checkboxes__item:nth-child(2)');
  const firefoxCheckbox = supportedBrowserQuestion.find('.nhsuk-checkboxes__item:nth-child(3)');
  const operaCheckbox = supportedBrowserQuestion.find('.nhsuk-checkboxes__item:nth-child(4)');
  const safariCheckbox = supportedBrowserQuestion.find('.nhsuk-checkboxes__item:nth-child(5)');
  const chromiumCheckbox = supportedBrowserQuestion.find('.nhsuk-checkboxes__item:nth-child(6)');
  const internetExplorerElevenCheckbox = supportedBrowserQuestion.find('.nhsuk-checkboxes__item:nth-child(7)');
  const internetExplorerTenCheckbox = supportedBrowserQuestion.find('.nhsuk-checkboxes__item:nth-child(8)');

  await t
    .expect(googleChromeCheckbox.find('input:checked').exists).ok()
    .expect(edgeCheckbox.find('input:checked').exists).notOk()
    .expect(firefoxCheckbox.find('input:checked').exists).notOk()
    .expect(operaCheckbox.find('input:checked').exists).notOk()
    .expect(safariCheckbox.find('input:checked').exists).notOk()
    .expect(chromiumCheckbox.find('input:checked').exists).notOk()
    .expect(internetExplorerElevenCheckbox.find('input:checked').exists).notOk()
    .expect(internetExplorerTenCheckbox.find('input:checked').exists).ok();

  const mobileResponsiveQuestion = Selector('[data-test-id="question-mobile-responsive"]');
  const yesRadiobutton = mobileResponsiveQuestion.find('.nhsuk-radios__item:nth-child(1)');
  const noRadiobutton = mobileResponsiveQuestion.find('.nhsuk-radios__item:nth-child(2)');

  await t
    .expect(yesRadiobutton.find('input:checked').exists).ok()
    .expect(noRadiobutton.find('input:checked').exists).notOk();
});

test('should render the validation errors indicating the supported browsers and mobile responsive questions are mandatory', async (t) => {
  pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/browser-based')
    .reply(200, aBrowserBasedFixture);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/browsers-supported')
    .reply(400, {
      required: ['supported-browsers', 'mobile-responsive'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const supportedBrowsersQuestion = Selector('[data-test-id="question-supported-browsers"]');
  const mobileResponsiveQuestion = Selector('[data-test-id="question-mobile-responsive"]');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(2)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Please select what browsers are supported')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#supported-browsers')
    .expect(errorSummaryList.find('li:nth-child(2)').innerText).eql('Please select if your solution is mobile responsive')
    .expect(errorSummaryList.find('li:nth-child(2) a').getAttribute('href')).eql('#mobile-responsive')

    .expect(supportedBrowsersQuestion.find('[data-test-id="checkbox-options-error"]').exists).ok()
    .expect(supportedBrowsersQuestion.find('.nhsuk-error-message').innerText).eql('Error:\nPlease select what browsers are supported')
    .expect(mobileResponsiveQuestion.find('[data-test-id="radiobutton-options-error"]').exists).ok()
    .expect(mobileResponsiveQuestion.find('.nhsuk-error-message').innerText).eql('Error:\nPlease select if your solution is mobile responsive');
});

test('should render the return to all sections link', async (t) => {
  pageSetup(t);

  const link = Selector('[data-test-id="section-back-link"] a');

  await t
    .expect(link.innerText).eql('Return to all sections');
});

test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
  pageSetup(t);

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
