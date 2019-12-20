import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../../../../manifestProvider';
import dashboardWithCompleteSections from '../../../../../fixtures/dashboardWithCompleteSections.json';

const browserHardwareRequirementMarketingData = {
  'hardware-requirements-description': 'Some hardware requirement detail',
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/browser-hardware-requirements')
      .reply(200, browserHardwareRequirementMarketingData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/browser-hardware-requirements')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/browser-hardware-requirements');
};

fixture('Show browser hardware requirement page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the Hardware requirement page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Browser based - hardware requirements');
});

test('should render main advice of section', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Answer the following questions about your browser based Solution');
});

test('should render all the advice of the section', async (t) => {
  await pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest({ dashboardId: 'browser-based', sectionId: 'browser-hardware-requirements' });
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the hardware requirements description question', async (t) => {
  await pageSetup(t);

  const hardwareRequirementsQuestion = Selector('[data-test-id="question-hardware-requirements-description"]');

  await t
    .expect(hardwareRequirementsQuestion.find('label.nhsuk-label').innerText).eql('Do you have any hardware requirements?')
    .expect(hardwareRequirementsQuestion.find('span.nhsuk-hint').innerText).eql('Add a description of any hardware requirements for you Solution.')
    .expect(hardwareRequirementsQuestion.find('textarea').count).eql(1)
    .expect(hardwareRequirementsQuestion.find('[data-test-id="textarea-field-footer"]').innerText).eql('You can enter up to 500 characters');
});

test('should render the submit button', async (t) => {
  await pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1)
    .expect(submitButton.find('button').innerText).eql('Save and return');
});

test('should populate the questions with existing data', async (t) => {
  pageSetup(t, true);

  const hardwareRequirementsQuestion = Selector('[data-test-id="question-hardware-requirements-description"]');

  await t
    .expect(hardwareRequirementsQuestion.find('textarea').value).eql('Some hardware requirement detail');
});

test('should show error summary and validation for questions when they exceed the maxLength', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/browser-hardware-requirements')
    .reply(400, {
      maxLength: ['hardware-requirements-description'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const hardwareRequirementsQuestion = Selector('[data-test-id="question-hardware-requirements-description"]');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Hardware requirement description is over the character limit')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#hardware-requirements-description')
    .expect(hardwareRequirementsQuestion.find('.nhsuk-textarea--error').exists).ok()
    .expect(hardwareRequirementsQuestion.find('.nhsuk-error-message').innerText).eql('Error:\nHardware requirement description is over the character limit');
});

test('should goto anchor when clicking the hardware requirement max length summary error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/browser-hardware-requirements')
    .reply(400, {
      maxLength: ['hardware-requirements-description'],
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
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#hardware-requirements-description')
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/solution/S100000-001/dashboard/browser-based/section/browser-hardware-requirements#hardware-requirements-description');
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
