import nock from 'nock';
import { Selector } from 'testcafe';
import previewWithNoMarketingData from './fixtures/previewWithNoMarketingData.json';
import previewWithMarketingData from './fixtures/previewWithMarketingData.json';

const mocks = (existingData) => {
  if (!existingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/preview')
      .reply(200, previewWithNoMarketingData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/preview')
      .reply(200, previewWithMarketingData);
  }
};

const pageSetup = async (t, existingData = false) => {
  mocks(existingData);
  await t.navigateTo('http://localhost:1234/S100000-001/preview');
};

fixture('Show marketing preview page');

test('should render the marketing preview page title', async (t) => {
  pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(title.innerText).eql('Preview Page');
});

test('when no existing marketing data - The solution description section should not be rendered', async (t) => {
  pageSetup(t);

  const solutionDescriptionSection = Selector('[data-test-id="preview-solution-description"]');

  await t
    .expect(solutionDescriptionSection.exists).notOk();
});

test('when existing marketing data - The solution description section and all questions should be rendered', async (t) => {
  pageSetup(t, true);

  const solutionDescriptionSection = Selector('[data-test-id="preview-solution-description"]');
  const summaryQuestion = Selector('[data-test-id="preview-section-question-summary"]');
  const descriptionQuestion = Selector('[data-test-id="preview-section-question-description"]');
  const linkQuestion = Selector('[data-test-id="preview-section-question-link"]');


  await t
    .expect(solutionDescriptionSection.exists).ok()
    .expect(solutionDescriptionSection.find('h3').innerText).eql('Solution description')

    .expect(summaryQuestion.exists).ok()
    .expect(summaryQuestion.find('[data-test-id="preview-question-title"]').innerText).eql('Summary')
    .expect(summaryQuestion.find('[data-test-id="preview-question-data-text"]').innerText).eql('The solution summary')

    .expect(descriptionQuestion.exists).ok()
    .expect(descriptionQuestion.find('[data-test-id="preview-question-title"]').innerText).eql('About the solution')
    .expect(descriptionQuestion.find('[data-test-id="preview-question-data-text"]').innerText).eql('The solution description')

    .expect(linkQuestion.exists).ok()
    .expect(linkQuestion.find('[data-test-id="preview-question-title"]').exists).notOk()
    .expect(linkQuestion.find('[data-test-id="preview-question-data-link"]').innerText).eql('The solution link');
});

test('when no existing marketing data - The features section should not be rendered', async (t) => {
  pageSetup(t);
  const featuresSection = Selector('[data-test-id="preview-features"]');

  await t
    .expect(featuresSection.exists).notOk();
});

test('when existing marketing data - The features section should rendered and the features displayed', async (t) => {
  pageSetup(t, true);

  const featuresSection = Selector('[data-test-id="preview-features"]');
  const featureListingQuestion = Selector('[data-test-id="preview-section-question-listing"]');

  await t
    .expect(featuresSection.exists).ok()
    .expect(featuresSection.find('h3').innerText).eql('Features')

    .expect(featureListingQuestion.exists).ok()
    .expect(featureListingQuestion.find('[data-test-id="preview-question-title"]').exists).notOk()
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data-bulletlist"]').exists).ok()
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data-bulletlist"]').find('li').count).eql(3)
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data-bulletlist"]').find('li:nth-child(1)').innerText).eql('Feature A')
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data-bulletlist"]').find('li:nth-child(2)').innerText).eql('Feature B')
    .expect(featureListingQuestion.find('[data-test-id="preview-question-data-bulletlist"]').find('li:nth-child(3)').innerText).eql('Feature C');
});

test('when no existing marketing data - The client-application-types section should not be rendered', async (t) => {
  pageSetup(t);

  const clientApplicationTypesSection = Selector('[data-test-id="preview-client-application-types"]');

  await t
    .expect(clientApplicationTypesSection.exists).notOk();
});

test('when existing marketing data - The client application type section and browser-based section should be rendered', async (t) => {
  pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="preview-client-application-types"]');
  const browserBasedExpandaleSection = Selector('[data-test-id="preview-section-browser-based"]');
  const browserBasedExpandaleSectionTable = Selector('[data-test-id="preview-section-table-browser-based"]');
  const supportedBrowsersRow = browserBasedExpandaleSectionTable.find('[data-test-id="preview-section-table-row-supported-browsers"]');
  const mobileResponsiveRow = browserBasedExpandaleSectionTable.find('[data-test-id="preview-section-table-row-mobile-responsive"]');
  const pluginsRequiredRow = browserBasedExpandaleSectionTable.find('[data-test-id="preview-section-table-row-plugins-required"]');
  const pluginsDetailRow = browserBasedExpandaleSectionTable.find('[data-test-id="preview-section-table-row-plugins-detail"]');

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(clientApplicationTypesSection.find('h3').innerText).eql('Client application type')

    .expect(browserBasedExpandaleSection.exists).ok()
    .expect(browserBasedExpandaleSection.innerText).eql('Browser based application')
    .expect(browserBasedExpandaleSection.find('div[aria-hidden="true"]').exists).ok()

    .click(browserBasedExpandaleSection.find('summary'))
    .expect(browserBasedExpandaleSection.find('div[aria-hidden="true"]').exists).notOk()
    .expect(supportedBrowsersRow.find('.nhsuk-summary-list__key').innerText).eql('Browsers Supported')
    .expect(supportedBrowsersRow.find('.nhsuk-summary-list__value').innerText).eql('Google Chrome\nMozilla Firefox')
    .expect(mobileResponsiveRow.find('.nhsuk-summary-list__key').innerText).eql('Mobile responsive')
    .expect(mobileResponsiveRow.find('.nhsuk-summary-list__value').innerText).eql('Yes')
    .expect(pluginsRequiredRow.find('.nhsuk-summary-list__key').innerText).eql('Plug ins or extensions required')
    .expect(pluginsRequiredRow.find('.nhsuk-summary-list__value').innerText).eql('Yes')
    .expect(pluginsDetailRow.find('.nhsuk-summary-list__key').innerText).eql('Plug ins or extensions information')
    .expect(pluginsDetailRow.find('.nhsuk-summary-list__value').innerText).eql('The plugin detail');
});
