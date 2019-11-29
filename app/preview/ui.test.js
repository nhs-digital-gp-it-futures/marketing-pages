import nock from 'nock';
import { Selector } from 'testcafe';
import previewWithNoMarketingData from '../../fixtures/previewWithNoMarketingData.json';
import previewWithMarketingData from '../../fixtures/previewWithMarketingData.json';

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

  const solutionDescriptionSection = Selector('[data-test-id="view-solution-description"]');

  await t
    .expect(solutionDescriptionSection.exists).notOk();
});

test('when existing marketing data - The solution description section and all questions should be rendered', async (t) => {
  pageSetup(t, true);

  const solutionDescriptionSection = Selector('[data-test-id="view-solution-description"]');
  const summaryQuestion = Selector('[data-test-id="view-section-question-summary"]');
  const descriptionQuestion = Selector('[data-test-id="view-section-question-description"]');
  const linkQuestion = Selector('[data-test-id="view-section-question-link"]');


  await t
    .expect(solutionDescriptionSection.exists).ok()
    .expect(solutionDescriptionSection.find('h3').innerText).eql('Solution description')

    .expect(summaryQuestion.exists).ok()
    .expect(summaryQuestion.find('[data-test-id="view-question-title"]').innerText).eql('Summary')
    .expect(summaryQuestion.find('[data-test-id="view-question-data-text-summary"]').innerText).eql('The solution summary')

    .expect(descriptionQuestion.exists).ok()
    .expect(descriptionQuestion.find('[data-test-id="view-question-title"]').innerText).eql('About the solution')
    .expect(descriptionQuestion.find('[data-test-id="view-question-data-text-description"]').innerText).eql('The solution description')

    .expect(linkQuestion.exists).ok()
    .expect(linkQuestion.find('[data-test-id="view-question-title"]').exists).notOk()
    .expect(linkQuestion.find('[data-test-id="view-question-data-link"]').innerText).eql('The solution link');
});

test('when no existing marketing data - The features section should not be rendered', async (t) => {
  pageSetup(t);
  const featuresSection = Selector('[data-test-id="view-features"]');

  await t
    .expect(featuresSection.exists).notOk();
});

test('when existing marketing data - The features section should rendered and the features displayed', async (t) => {
  pageSetup(t, true);

  const featuresSection = Selector('[data-test-id="view-features"]');

  await t
    .expect(featuresSection.exists).ok()
    .expect(featuresSection.find('h3').innerText).eql('Features')

    .expect(featuresSection.exists).ok()
    .expect(featuresSection.find('[data-test-id="view-question-title"]').exists).notOk()
    .expect(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').exists).ok()
    .expect(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li').count).eql(3)
    .expect(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li:nth-child(1)').innerText).eql('Feature A')
    .expect(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li:nth-child(2)').innerText).eql('Feature B')
    .expect(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li:nth-child(3)').innerText).eql('Feature C');
});

test('when no existing marketing data - The client-application-types section should not be rendered', async (t) => {
  pageSetup(t);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');

  await t
    .expect(clientApplicationTypesSection.exists).notOk();
});

test('when existing marketing data - The client application type section and browser-based section should be rendered', async (t) => {
  pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const browserBasedExpandableSection = Selector('[data-test-id="view-section-browser-based"]');
  const browserBasedExpandaleSectionTable = Selector('[data-test-id="view-section-table-browser-based"]');
  const supportedBrowsersRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-supported-browsers"]');
  const mobileResponsiveRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-mobile-responsive"]');
  const pluginsRequiredRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-plugins-required"]');
  const pluginsDetailRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-plugins-detail"]');

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(clientApplicationTypesSection.find('h3').innerText).eql('Client application type')

    .expect(browserBasedExpandableSection.exists).ok()
    .expect(browserBasedExpandableSection.innerText).eql('Browser based application')
    .expect(browserBasedExpandableSection.find('details[open]').exists).notOk()
    .click(browserBasedExpandableSection.find('summary'))
    .expect(browserBasedExpandableSection.find('details[open]').exists).ok()
    .expect(supportedBrowsersRow.find('.nhsuk-summary-list__key').innerText).eql('Browsers Supported')
    .expect(supportedBrowsersRow.find('.nhsuk-summary-list__value').innerText).eql('Google Chrome\nMozilla Firefox')
    .expect(mobileResponsiveRow.find('.nhsuk-summary-list__key').innerText).eql('Mobile responsive')
    .expect(mobileResponsiveRow.find('.nhsuk-summary-list__value').innerText).eql('Yes')
    .expect(pluginsRequiredRow.find('.nhsuk-summary-list__key').innerText).eql('Plug-ins or extensions required')
    .expect(pluginsRequiredRow.find('.nhsuk-summary-list__value').innerText).eql('Yes')
    .expect(pluginsDetailRow.find('.nhsuk-summary-list__key').innerText).eql('Plug-ins or extensions information')
    .expect(pluginsDetailRow.find('.nhsuk-summary-list__value').innerText).eql('The plugin detail');
});
