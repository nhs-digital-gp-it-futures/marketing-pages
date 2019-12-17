import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../../../manifestProvider';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const pluginsOrExtensionsMarketingData = {
  'plugins-required': 'Yes',
  'plugins-detail': 'Some plugin and extension detail',
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/plug-ins-or-extensions')
      .reply(200, pluginsOrExtensionsMarketingData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/plug-ins-or-extensions')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/solution/S100000-001/section/plug-ins-or-extensions');
};

fixture('Show Plug-ins Or Extensions page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the Plug-ins Or Extensions page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Browser based - plug-ins or extensions');
});

test('should render main advice of section', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Answer the following questions about your browser based Solution');
});

test('should render all the advice of the section', async (t) => {
  await pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest('plug-ins-or-extensions');
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the plugin required question', async (t) => {
  await pageSetup(t);

  const pluginsRequiredQuestion = Selector('[data-test-id="question-plugins-required"]');

  await t
    .expect(pluginsRequiredQuestion.find('.nhsuk-fieldset__legend').innerText).eql('Are any plug-ins or browser extensions required?*')
    .expect(pluginsRequiredQuestion.find('.nhsuk-hint').innerText).eql('Please select below if your Solution requires any plug-ins or browser extentions.')
    .expect(pluginsRequiredQuestion.find('.nhsuk-radios').count).eql(1)
    .expect(pluginsRequiredQuestion.find('.nhsuk-radios__item').count).eql(2);
});

test('should render the plugins detail question', async (t) => {
  await pageSetup(t);

  const pluginsDetailQuestion = Selector('[data-test-id="question-plugins-detail"]');

  await t
    .expect(pluginsDetailQuestion.find('label.nhsuk-label').innerText).eql('If any plug-ins or browser extensions are required, provide more detail or constraints')
    .expect(pluginsDetailQuestion.find('span.nhsuk-hint').innerText).eql('Tell buyers more information about the plug-ins or extensions required.')
    .expect(pluginsDetailQuestion.find('textarea').count).eql(1)
    .expect(pluginsDetailQuestion.find('[data-test-id="textarea-field-footer"]').innerText).eql('You can enter up to 500 characters');
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

  const pluginsRequiredQuestion = Selector('[data-test-id="question-plugins-required"]');
  const yesRadiobutton = pluginsRequiredQuestion.find('.nhsuk-radios__item:nth-child(1)');
  const noRadiobutton = pluginsRequiredQuestion.find('.nhsuk-radios__item:nth-child(2)');

  await t
    .expect(yesRadiobutton.find('input:checked').exists).ok()
    .expect(noRadiobutton.find('input:checked').exists).notOk();

  const pluginsDetailQuestion = Selector('[data-test-id="question-plugins-detail"]');

  await t
    .expect(pluginsDetailQuestion.find('textarea').value).eql('Some plugin and extension detail');
});

test('should show error summary and validation for questions when they exceed the maxLength', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/plug-ins-or-extensions')
    .reply(400, {
      maxLength: ['plugins-detail'],
    });

  const oneHundredCharacters = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
  const fiveHundredCharacters = oneHundredCharacters.repeat(5);

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const pluginsDetailQuestion = Selector('[data-test-id="question-plugins-detail"]');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .typeText(pluginsDetailQuestion, `${fiveHundredCharacters}0`, { paste: true })
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Plug-ins or browser extensions detail is over the character limit')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#plugins-detail')
    .expect(pluginsDetailQuestion.find('.nhsuk-textarea--error').exists).ok()
    .expect(pluginsDetailQuestion.find('.nhsuk-error-message').innerText).eql('Error:\nPlug-ins or browser extensions detail is over the character limit');
});

test('should show error summary and validation for plugins required question indicating it is mandatory', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/plug-ins-or-extensions')
    .reply(400, {
      required: ['plugins-required'],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const pluginsRequiredQuestion = Selector('[data-test-id="question-plugins-required"]');
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql('Please select whether or not plug-ins or browser extensions are required')
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#plugins-required')

    .expect(pluginsRequiredQuestion.find('[data-test-id="radiobutton-options-error"]').exists).ok()
    .expect(pluginsRequiredQuestion.find('.nhsuk-error-message').innerText).eql('Error:\nPlease select whether or not plug-ins or browser extensions are required');
});

test('should goto anchor when clicking the plugin required summary error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/plug-ins-or-extensions')
    .reply(400, {
      required: ['plugins-required'],
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
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#plugins-required')
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/plug-ins-or-extensions#plugins-required');
});

test('should goto anchor when clicking the plugin detail summary error link', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001/sections/plug-ins-or-extensions')
    .reply(400, {
      maxLength: ['plugins-detail'],
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
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#plugins-detail')
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/plug-ins-or-extensions#plugins-detail');
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
