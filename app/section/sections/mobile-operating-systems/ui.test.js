import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../../../manifestProvider';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const sectionId = 'mobile-operating-systems';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;

const mobileOperatingSystemsMarketingData = {
  'operating-systems': ['apple-ios', 'android', 'other'],
  'operating-systems-description': 'Text for description',
};

const sectionManifest = new ManifestProvider().getSectionManifest({ sectionId });

const getLocation = ClientFunction(() => document.location.href);

const mocks = (responseStatus, responseBody) => {
  nock('http://localhost:8080')
    .get(sectionApiUrl)
    .reply(responseStatus, responseBody);
};

const pageSetup = async (t, responseStatus = 200, responseBody = {}) => {
  mocks(responseStatus, responseBody);
  await t.navigateTo(`http://localhost:1234/solution/S100000-001/section/${sectionId}`);
};

fixture('Show mobile operating systems')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the page title', async (t) => {
  await pageSetup(t);
  const title = Selector('[data-test-id="section-title"]');
  await t
    .expect(title.innerText).eql(sectionManifest.title);
});

test('should render main advice of section', async (t) => {
  await pageSetup(t);
  const mainAdvice = Selector('[data-test-id="section-main-advice"]');
  await t
    .expect(mainAdvice.innerText).eql(sectionManifest.mainAdvice);
});

test('should render all the advice of the section', async (t) => {
  await pageSetup(t);
  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');
  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the operating systems question', async (t) => {
  const question = 'operating-systems';
  const expectedOperatingSystems = sectionManifest.questions[question];
  await pageSetup(t);
  const operatingSystemsQuestion = Selector(`[data-test-id="question-${question}"]`);
  const appleIOSCheckbox = operatingSystemsQuestion.find('.nhsuk-checkboxes__item:nth-child(1)');
  const androidCheckbox = operatingSystemsQuestion.find('.nhsuk-checkboxes__item:nth-child(2)');
  const otherCheckbox = operatingSystemsQuestion.find('.nhsuk-checkboxes__item:nth-child(3)');
  await t
    .expect(operatingSystemsQuestion.find('.nhsuk-fieldset__legend').innerText).eql(expectedOperatingSystems.mainAdvice)
    .expect(operatingSystemsQuestion.find('.nhsuk-hint').innerText).eql(expectedOperatingSystems.additionalAdvice)
    .expect(operatingSystemsQuestion.find('.nhsuk-checkboxes').count).eql(1)
    .expect(operatingSystemsQuestion.find('.nhsuk-checkboxes__item').count).eql(3)
    .expect(appleIOSCheckbox.innerText).eql(expectedOperatingSystems.options['apple-ios'])
    .expect(androidCheckbox.innerText).eql(expectedOperatingSystems.options.android)
    .expect(otherCheckbox.innerText).eql(expectedOperatingSystems.options.other);
});

test('should populate the operating systems checkboxes with existing data', async (t) => {
  await pageSetup(t, 200, mobileOperatingSystemsMarketingData);
  const operatingSystemsQuestion = Selector('[data-test-id="question-operating-systems"]');
  const appleIOSCheckbox = operatingSystemsQuestion.find('.nhsuk-checkboxes__item:nth-child(1)');
  const androidCheckbox = operatingSystemsQuestion.find('.nhsuk-checkboxes__item:nth-child(2)');
  const otherCheckbox = operatingSystemsQuestion.find('.nhsuk-checkboxes__item:nth-child(3)');

  await t
    .expect(appleIOSCheckbox.find('input:checked').exists).ok()
    .expect(androidCheckbox.find('input:checked').exists).ok()
    .expect(otherCheckbox.find('input:checked').exists).ok();
});

test('should render the operating systems description question', async (t) => {
  const question = 'operating-systems-description';
  await pageSetup(t);
  const operatingSystemsDescriptionQuestion = Selector(`[data-test-id="question-${question}"]`);
  const expectedDescription = sectionManifest.questions[question];
  await t
    .expect(operatingSystemsDescriptionQuestion.find('label.nhsuk-label').innerText).eql(expectedDescription.mainAdvice)
    .expect(operatingSystemsDescriptionQuestion.find('span.nhsuk-hint').innerText).eql(expectedDescription.additionalAdvice)
    .expect(operatingSystemsDescriptionQuestion.find('textarea').count).eql(1)
    .expect(operatingSystemsDescriptionQuestion.find('[data-test-id="textarea-field-footer"]').innerText).eql(expectedDescription.footerAdvice);
});

test('should populate the operating systems description textarea with existing data', async (t) => {
  await pageSetup(t, 200, mobileOperatingSystemsMarketingData);
  const descriptionQuestion = Selector('[data-test-id="question-operating-systems-description"]');

  await t
    .expect(descriptionQuestion.find('textarea').value).eql(mobileOperatingSystemsMarketingData['operating-systems-description']);
});

test('should show error summary and validation for operating systems description when it exceeds the maxLength', async (t) => {
  const question = 'operating-systems-description';
  await pageSetup(t);
  nock('http://localhost:8080')
    .put(sectionApiUrl)
    .reply(400, {
      maxLength: [question],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const operatingSystemsDescription = Selector(`[data-test-id="question-${question}"]`);

  const submitButton = Selector('[data-test-id="section-submit-button"]');
  const expectedDescription = sectionManifest.questions[question];
  await t
    .expect(errorSummary.exists).notOk()
    .typeText(operatingSystemsDescription, `${'x'.repeat(501)}`, { paste: true })
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql(expectedDescription.errorResponse.maxLength)
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql('#operating-systems-description')
    .expect(operatingSystemsDescription.find('.nhsuk-textarea--error').exists).ok()
    .expect(operatingSystemsDescription.find('.nhsuk-error-message').innerText).eql(`Error:\n${expectedDescription.errorResponse.maxLength}`);
});

test('should show error summary and validation for operating systems is mandatory', async (t) => {
  const question = 'operating-systems';
  await pageSetup(t);

  nock('http://localhost:8080')
    .put(sectionApiUrl)
    .reply(400, {
      required: [question],
    });

  const errorSummary = Selector('[data-test-id="error-summary"]');
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const clientApplicationTypesQuestion = Selector(`[data-test-id="question-${question}"]`);
  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(errorSummary.exists).notOk()
    .click(submitButton.find('button'))
    .expect(errorSummary.exists).ok()
    .expect(errorSummaryList.find('li').count).eql(1)
    .expect(errorSummaryList.find('li:nth-child(1)').innerText).eql(sectionManifest.questions[question].errorResponse.required)
    .expect(errorSummaryList.find('li:nth-child(1) a').getAttribute('href')).eql(`#${question}`)

    .expect(clientApplicationTypesQuestion.find('[data-test-id="checkbox-options-error"]').exists).ok()
    .expect(clientApplicationTypesQuestion.find('.nhsuk-error-message').innerText).eql(`Error:\n${sectionManifest.questions[question].errorResponse.required}`);
});

test('should go to anchor when clicking the operating systems description error link', async (t) => {
  const question = 'operating-systems-description';
  await pageSetup(t);
  nock('http://localhost:8080')
    .put(sectionApiUrl)
    .reply(400, {
      maxLength: [question],
    });
  const errorSummaryList = Selector('.nhsuk-error-summary__list');
  const submitButton = Selector('[data-test-id="section-submit-button"]');
  await t
    .click(submitButton.find('button'))
    .click(errorSummaryList.find('li:nth-child(1) a'))
    .expect(getLocation()).contains(`/solution/S100000-001/section/${sectionId}#${question}`);
});

test('should render the submit button', async (t) => {
  await pageSetup(t);
  const submitButton = Selector('[data-test-id="section-submit-button"]');
  await t
    .expect(submitButton.find('button').count).eql(1)
    .expect(submitButton.find('button').innerText).eql(sectionManifest.submitText);
});

// test('should go to the native mobile dashboard when clicking the submit button', async (t) => {
//   await pageSetup(t, 200, mobileOperatingSystemsMarketingData);

//   nock('http://localhost:8080')
//     .put(sectionApiUrl)
//     .reply(200, mobileOperatingSystemsMarketingData);

//   nock('http://localhost:8080')
//     .get('/api/v1/Solutions/S100000-001/sections/native-mobile')
//     .reply(200, {});

//   const submitButton = Selector('[data-test-id="section-submit-button"] button');

//   await t
//     .expect(submitButton.exists).ok()
//     .click(submitButton)
//     .expect(getLocation()).contains(sectionManifest.successfulSubmitResponsePath);
// });

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
  const link = Selector('[data-test-id="section-back-link"] a');
  await t
    .click(link)
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('/solution/S100000-001');
});
