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
  await t.navigateTo('http://localhost:1234/solution/S100000-001/preview');
};

fixture('Show marketing preview page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the marketing preview page title', async (t) => {
  await pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(title.innerText).eql('Preview Page');
});

test('when no existing marketing data - The solution description section should not be rendered', async (t) => {
  await pageSetup(t);

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
  await pageSetup(t);
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
  await pageSetup(t);

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
  const mobileFirstRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-mobile-first-design"]');
  const pluginsRequiredRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-plugins-required"]');
  const pluginsDetailRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-plugins-detail"]');
  const minimumConnectionRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-connection-speed"]');
  const minimumResolutionRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-desktop-resolution"]');
  const hardwareRequirementsDescriptionRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-hardware-requirements-description"]');
  const additionalInformationRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-additional-information"]');

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(clientApplicationTypesSection.find('h3').innerText).eql('Client application type')

    .expect(browserBasedExpandableSection.exists).ok()
    .expect(browserBasedExpandableSection.innerText).eql('Browser based application')
    .expect(browserBasedExpandableSection.find('details[open]').exists).notOk()
    .click(browserBasedExpandableSection.find('summary'))
    .expect(browserBasedExpandableSection.find('details[open]').exists).ok()

    .expect(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Browsers Supported')
    .expect(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Google Chrome\nMozilla Firefox')
    .expect(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(mobileResponsiveRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Mobile responsive')
    .expect(mobileResponsiveRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Yes')
    .expect(mobileResponsiveRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Designed with a mobile first approach')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Yes')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(pluginsRequiredRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Plug-ins or extensions required')
    .expect(pluginsRequiredRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Yes')
    .expect(pluginsRequiredRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(pluginsDetailRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Plug-ins or extensions information')
    .expect(pluginsDetailRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('The plugin detail')
    .expect(pluginsDetailRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Minimum connection speed required')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('1Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumResolutionRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Recommended desktop aspect ratio and screen resolution')
    .expect(minimumResolutionRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('4:3 800 x 600')
    .expect(minimumResolutionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Hardware requirements')
    .expect(hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Some hardware requirement description')
    .expect(hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Additional information')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Some browser additional information')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('when existing marketing data - The client application type section and native-mobile section should be rendered', async (t) => {
  pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const nativeMobileExpandableSection = Selector('[data-test-id="view-section-native-mobile"]');
  const nativeMobileExpandaleSectionTable = Selector('[data-test-id="view-section-table-native-mobile"]');
  const operatingSystemRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-operating-systems"]');
  const operatingSystemDescriptionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-operating-systems-description"]');
  const mobileFirstRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-mobile-first-design"]');
  const minimumMemoryRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-memory-requirement"]');
  const storageDescriptionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-storage-requirements-description"]');
  const minimumConnectionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-connection-speed"]');
  const connectionRequirementsRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-connection-types"]');
  const connectionDescriptionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-connection-requirements-description"]');

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(clientApplicationTypesSection.find('h3').innerText).eql('Client application type')

    .expect(nativeMobileExpandableSection.exists).ok()
    .expect(nativeMobileExpandableSection.innerText).eql('Native mobile or tablet application')
    .expect(nativeMobileExpandableSection.find('details[open]').exists).notOk()
    .click(nativeMobileExpandableSection.find('summary'))
    .expect(nativeMobileExpandableSection.find('details[open]').exists).ok()

    .expect(operatingSystemRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Supported operating systems')
    .expect(operatingSystemRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Apple IOS\nAndroid\nOther')
    .expect(operatingSystemRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Additional operating system information')
    .expect(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Android 4.1 and above, IOS 10.6 and above.')
    .expect(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Designed with a mobile first approach')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Yes')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumMemoryRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Minimum memory requirement')
    .expect(minimumMemoryRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('4GB')
    .expect(minimumMemoryRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(storageDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Additional storage requirements')
    .expect(storageDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('You will need at least 4GB of free space on each device the application is installed. It is advised to use an external SD card for additional storage.')
    .expect(storageDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Minimum connection speed required')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('1Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Connection types supported')
    .expect(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('GPRS\n3G\n4G\nWifi')
    .expect(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(connectionDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText).eql('Additional information about connection types')
    .expect(connectionDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText).eql('Average data usage will vary depending on application activity.')
    .expect(connectionDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok();
});
