import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../../../../manifestProvider';
import dashboardWithCompleteSections from '../../../../../fixtures/dashboardWithCompleteSections.json';

const connectivityAndResolutionMarketingData = {
  'minimum-connection-speed': '1Mbps',
  'minimum-desktop-resolution': '16:9 - 2048 x 1152',
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/connectivity-and-resolution')
      .reply(200, connectivityAndResolutionMarketingData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/connectivity-and-resolution')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/connectivity-and-resolution');
};

fixture('Show Connectivity And Resolution page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the Connectivity And Resolution page title', async (t) => {
  pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Browser based - connectivity and resolution');
});

test('should render main advice of section', async (t) => {
  pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Answer the following questions about your browser based Solution');
});

test('should render all the advice of the section', async (t) => {
  pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest({ dashboardId: 'browser-based', sectionId: 'connectivity-and-resolution' });
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the minimum connection speed question', async (t) => {
  pageSetup(t);

  const minimumConnectionSpeedQuestion = Selector('[data-test-id="combobox-options-minimum-connection-speed"]');

  await t
    .expect(minimumConnectionSpeedQuestion.find('.nhsuk-label').innerText).eql('Select the minimum connection speed required for your Solution to function?*')
    .expect(minimumConnectionSpeedQuestion.find('.nhsuk-hint').innerText).eql('Please select below the minimum bandwidth requirement.')
    .expect(minimumConnectionSpeedQuestion.find('select').exists).ok()
    .expect(minimumConnectionSpeedQuestion.find('option').count).eql(13);
});

test('should render the minimum desktop resolution question', async (t) => {
  pageSetup(t);

  const minimumDesktopResolutionQuestion = Selector('[data-test-id="combobox-options-minimum-desktop-resolution"]');

  await t
    .expect(minimumDesktopResolutionQuestion.find('.nhsuk-label').innerText).eql('Select the minimum desktop aspect ratio and screen resolution?')
    .expect(minimumDesktopResolutionQuestion.find('.nhsuk-hint').innerText).eql('Please select below the minimum resolution required for your Solution to function on desktop.')
    .expect(minimumDesktopResolutionQuestion.find('select').exists).ok()
    .expect(minimumDesktopResolutionQuestion.find('option').count).eql(20);
});

test('should render the submit button', async (t) => {
  pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1)
    .expect(submitButton.find('button').innerText).eql('Save and return');
});

test('should populate the questions with existing data', async (t) => {
  pageSetup(t, true);

  const minimumConnectionSpeedQuestion = Selector('[data-test-id="combobox-options-minimum-connection-speed"]');
  const minimumDesktopResolutionQuestion = Selector('[data-test-id="combobox-options-minimum-desktop-resolution"]');

  await t
    .expect(minimumConnectionSpeedQuestion.find('option[selected]').exists).ok()
    .expect(minimumConnectionSpeedQuestion.find('option[selected]').getAttribute('value')).eql('1Mbps')

    .expect(minimumDesktopResolutionQuestion.find('option[selected]').exists).ok()
    .expect(minimumDesktopResolutionQuestion.find('option[selected]').getAttribute('value')).eql('16:9 - 2048 x 1152');
});

test('should show error summary and validation for minimum connection speed question indicating it is mandatory', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/connectivity-and-resolution')
    .reply(400, {
      required: ['minimum-connection-speed'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const minimumConnectionSpeedQuestion = Selector('[data-test-id="combobox-options-minimum-connection-speed"]');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Please select the minimum connection speed required')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#minimum-connection-speed')

    .expect(minimumConnectionSpeedQuestion.find('[data-test-id="combobox-options-error"]').exists).ok()
    .expect(minimumConnectionSpeedQuestion.find('.nhsuk-error-message').innerText).eql('Error:\nPlease select the minimum connection speed required');
});

test('should goto anchor when clicking the minimum connection speed summary error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/connectivity-and-resolution')
    .reply(400, {
      required: ['minimum-connection-speed'],
    });

  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click(submitButton.find('button'))
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/solution/S100000-001/dashboard/browser-based/section/connectivity-and-resolution#minimum-connection-speed');
});

test('should goto the browser based dashboard when clicking the submit button', async (t) => {
  await pageSetup(t, 200, connectivityAndResolutionMarketingData);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/connectivity-and-resolution')
    .reply(200, connectivityAndResolutionMarketingData);

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
    .expect(getLocation()).contains('/solution/S100000-001');
});
