import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../app/forms/manifestProvider';

const browserSupportedMarketingData = {};

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

  const supportedBrowsersQuestion = Selector('[data-test-id="checkbox-options-supported-browsers"]');

  await t
    .expect(supportedBrowsersQuestion.find('.nhsuk-fieldset__legend').innerText).eql('What browsers are supported? Select all that apply*')
    .expect(supportedBrowsersQuestion.find('.nhsuk-hint').innerText).eql('If your Solution is browser based, please select below all the browsers your Solution supports.')
    .expect(supportedBrowsersQuestion.find('.nhsuk-checkboxes').count).eql(1)
    .expect(supportedBrowsersQuestion.find('.nhsuk-checkboxes__item').count).eql(8);
});

test('should render the mobile responsive question', async (t) => {
  pageSetup(t);

  const mobileResponsiveQuestion = Selector('[data-test-id="radiobutton-options-mobile-responsive"]');

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

test('should render the return to all sections link', async (t) => {
  pageSetup(t);

  const link = Selector('[data-test-id="section-back-link"] a');

  await t
    .expect(link.innerText).eql('Return to all sections');
});
