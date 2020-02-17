import nock from 'nock';
import { Selector } from 'testcafe';
import previewWithNoMarketingData from '../../../../fixtures/previewWithNoMarketingData.json';
import previewWithMarketingData from '../../../../fixtures/previewWithMarketingData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../../../test-utils/config';
import { extractInnerText } from '../../../test-utils/helper';

const mocks = (existingData) => {
  if (!existingData) {
    nock(apiLocalhost)
      .get(`${apiPath}/preview`)
      .reply(200, previewWithNoMarketingData);
  } else {
    nock(apiLocalhost)
      .get(`${apiPath}/preview`)
      .reply(200, previewWithMarketingData);
  }
};

const pageSetup = async (t, existingData = false) => {
  mocks(existingData);
  await t.navigateTo(`${clientLocalhost}/supplier/solution/S100000-001/preview`);
};

fixture('Show marketing preview page - heading components');

test('should render the marketing preview page back link', async (t) => {
  await pageSetup(t);

  const backLink = Selector('[data-test-id="view-solution-page-back-link"]');

  await t
    .expect(await extractInnerText(backLink)).eql('Go back to previous page');
});

test('should render the marketing preview page foundation tag', async (t) => {
  await pageSetup(t);

  const foundationTag = Selector('[data-test-id="view-solution-foundation"]');

  await t
    .expect(await extractInnerText(foundationTag)).eql('Foundation Solution Set');
});

test('should render the marketing preview page solution name', async (t) => {
  await pageSetup(t);

  const solutionName = Selector('[data-test-id="view-solution-page-solution-name"]');

  await t
    .expect(await extractInnerText(solutionName)).eql('Write on Time');
});

test('should render the marketing preview page supplier name', async (t) => {
  await pageSetup(t);

  const supplierName = Selector('[data-test-id="view-solution-page-supplier-name"]');

  await t
    .expect(await extractInnerText(supplierName)).eql('Really Kool Corporation');
});

test('should render the marketing preview page supplier name', async (t) => {
  await pageSetup(t);

  const solutionId = Selector('[data-test-id="view-solution-page-solution-id"]');

  await t
    .expect(await extractInnerText(solutionId)).eql('Solution ID: 100000-001');
});

test('should render the marketing preview page last updated date', async (t) => {
  await pageSetup(t);

  const lastUpdated = Selector('[data-test-id="view-solution-page-last-updated"]');

  await t
    .expect(await extractInnerText(lastUpdated)).eql('Solution information last updated: 15 March 1996');
});


fixture('Show marketing preview page - no existing marketing data');

test('Solution description section should not be rendered', async (t) => {
  await pageSetup(t);

  const solutionDescriptionSection = Selector('[data-test-id="view-solution-description"]');

  await t
    .expect(solutionDescriptionSection.exists).notOk();
});

test('Features section should not be rendered', async (t) => {
  await pageSetup(t);
  const featuresSection = Selector('[data-test-id="view-features"]');

  await t
    .expect(featuresSection.exists).notOk();
});

test('Capabilities section should not be rendered', async (t) => {
  await pageSetup(t);
  const capabilitiesSection = Selector('[data-test-id="view-capabilities"]');

  await t
    .expect(capabilitiesSection.exists).notOk();
});

test('Integrations section should not be rendered', async (t) => {
  await pageSetup(t);
  const integrationsSection = Selector('[data-test-id="view-integrations"]');

  await t
    .expect(integrationsSection.exists).notOk();
});

test('Implementation timescales section should not be rendered', async (t) => {
  await pageSetup(t);
  const integrationsSection = Selector('[data-test-id="view-implementation-timescales"]');

  await t
    .expect(integrationsSection.exists).notOk();
});

test('Client-application-types section should not be rendered', async (t) => {
  await pageSetup(t);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');

  await t
    .expect(clientApplicationTypesSection.exists).notOk();
});

test('Hosting type - public cloud section should not be rendered', async (t) => {
  await pageSetup(t);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');

  await t
    .expect(hostingTypesSection.exists).notOk();
});

test('Hosting type - private cloud section should not be rendered', async (t) => {
  await pageSetup(t);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');

  await t
    .expect(hostingTypesSection.exists).notOk();
});

test('Hosting type - hybrid section should not be rendered', async (t) => {
  await pageSetup(t);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');

  await t
    .expect(hostingTypesSection.exists).notOk();
});

test('Hosting type - on premise section should not be rendered', async (t) => {
  await pageSetup(t);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');

  await t
    .expect(hostingTypesSection.exists).notOk();
});

test('About supplier section should not be rendered', async (t) => {
  await pageSetup(t);

  const aboutSupplierSection = Selector('[data-test-id="view-about-supplier"]');

  await t
    .expect(aboutSupplierSection.exists).notOk();
});

test('Contact-details section should not be rendered', async (t) => {
  await pageSetup(t);

  const contactDetailsSection = Selector('[data-test-id="view-solution-contact-details"]');

  await t
    .expect(contactDetailsSection.exists).notOk();
});

test('Roadmap section should not be rendered', async (t) => {
  await pageSetup(t);

  const roadmapSection = Selector('[data-test-id="view-roadmap"]');

  await t
    .expect(roadmapSection.exists).notOk();
});

test('Learn More section should not be rendered', async (t) => {
  await pageSetup(t);

  const learnMoreSection = Selector('[data-test-id="view-learn-more"]');

  await t
    .expect(learnMoreSection.exists).notOk();
});


fixture('Show marketing preview page - with existing marketing data');

test('Solution description section and all questions should be rendered', async (t) => {
  await pageSetup(t, true);

  const solutionDescriptionSection = Selector('[data-test-id="view-solution-description"]');
  const summaryQuestion = solutionDescriptionSection.find('[data-test-id="view-section-table-row-summary"]');
  const descriptionQuestion = solutionDescriptionSection.find('[data-test-id="view-section-table-row-description"]');

  await t
    .expect(solutionDescriptionSection.exists).ok()
    .expect(await extractInnerText(solutionDescriptionSection.find('h3'))).eql('Description')

    .expect(summaryQuestion.exists).ok()
    .expect(await extractInnerText(summaryQuestion.find('[data-test-id="view-section-table-row-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryQuestion.find('[data-test-id="view-question-data-text-summary"]'))).eql('The solution summary')

    .expect(descriptionQuestion.exists).ok()
    .expect(await extractInnerText(descriptionQuestion.find('[data-test-id="view-section-table-row-title"]'))).eql('Full description')
    .expect(await extractInnerText(descriptionQuestion.find('[data-test-id="view-question-data-text-description"]'))).eql('The solution description')
    .expect(await extractInnerText(descriptionQuestion.find('[data-test-id="view-question-data-link"]'))).eql('The solution link');
});

test('Features section should be rendered and the features displayed', async (t) => {
  await pageSetup(t, true);

  const featuresSection = Selector('[data-test-id="view-features"]');

  await t
    .expect(featuresSection.exists).ok()
    .expect(await extractInnerText(featuresSection.find('h3'))).eql('Features')

    .expect(featuresSection.find('[data-test-id="view-question-title"]').exists).notOk()
    .expect(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').exists).ok()
    .expect(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li').count).eql(3)
    .expect(await extractInnerText(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li:nth-child(1)'))).eql('Feature A')
    .expect(await extractInnerText(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li:nth-child(2)'))).eql('Feature B')
    .expect(await extractInnerText(featuresSection.find('[data-test-id="view-question-data-bulletlist"]').find('li:nth-child(3)'))).eql('Feature C');
});

test('Capabilities section should be rendered and the capabilities and epics displayed', async (t) => {
  await pageSetup(t, true);

  const capabilitiesSection = Selector('[data-test-id="view-capabilities"]');
  const capabilitiesExpandableSection = Selector('[data-test-id="view-section-capabilities"]');
  const capabilitiesTitle = await extractInnerText(capabilitiesSection.find('[data-test-id="view-section-table-row-capabilities"]'));
  const capabilitiesTitleParts = capabilitiesTitle.split(/\n/);
  const epicsSection = capabilitiesSection.find('[data-test-id="view-question-epic"]');
  const mustEpics = epicsSection.find('[data-test-id="must-epics"]');
  const mayEpics = epicsSection.find('[data-test-id="may-epics"]');

  await t
    .expect(capabilitiesSection.exists).ok()
    .expect(await extractInnerText(capabilitiesSection.find('h3'))).eql('Capabilities met - NHS assured')
    .expect(capabilitiesSection.find('[data-test-id="view-section-table-row-capabilities"]').exists).ok()
    .expect(capabilitiesTitleParts[0].trim()).eql('Example capability, 1.0.1')
    .expect(capabilitiesTitleParts[1].trim()).eql('Describes the capability.')
    .expect(capabilitiesTitleParts[2].trim()).eql('How this capability was met')
    .expect(capabilitiesSection.find('[data-test-id="view-question-data-text-description"]').exists).ok()
    .expect(await extractInnerText(capabilitiesSection.find('[data-test-id="view-question-data-text-description"]'))).eql('Describes the capability.')

    .expect(capabilitiesExpandableSection.exists).ok()
    .expect(capabilitiesExpandableSection.find('details[open]').exists).notOk()
    .click(capabilitiesExpandableSection.find('summary'))
    .expect(capabilitiesExpandableSection.find('details[open]').exists).ok()
    .expect(capabilitiesExpandableSection.find('[data-test-id="view-question-data-text-link"] > a').getAttribute('href')).eql('https://link-to-capability.com')

    .expect(epicsSection.exists).ok()
    .expect(mustEpics.exists).ok()
    .expect(await extractInnerText(mustEpics.find('[data-test-id="must-tag"]'))).eql('Must epics')
    .expect(mustEpics.find('[data-test-id="must-met-epic-list"] li').count).eql(2)
    .expect(mustEpics.find('[data-test-id="must-not-met-epic-list"] li').count).eql(1)

    .expect(mayEpics.exists).ok()
    .expect(await extractInnerText(mayEpics.find('[data-test-id="may-tag"]'))).eql('May epics')
    .expect(mayEpics.find('[data-test-id="may-met-epic-list"] li').count).eql(1)
    .expect(mayEpics.find('[data-test-id="may-not-met-epic-list"] li').count).eql(1);
});

test('Integrations section should be rendered', async (t) => {
  await pageSetup(t, true);

  const integrationsSection = Selector('[data-test-id="view-integrations"]');
  const documentLink = integrationsSection.find('[data-test-id="view-question-data-text-link-authority-integrations"]');

  await t
    .expect(integrationsSection.exists).ok()
    .expect(await extractInnerText(integrationsSection.find('h3'))).eql('Integrations')
    .expect(await extractInnerText(documentLink)).eql('View NHS assured integrations')
    .expect(await documentLink.find('a').getAttribute('href')).eql('document/integration.pdf')
    .expect(await extractInnerText(integrationsSection.find('[data-test-id="view-question-data-text-link-supplier-integrations"]'))).eql('http://www.link.com');
});

test('Implementation timescales section should be rendered', async (t) => {
  await pageSetup(t, true);

  const implementationTimescalesSection = Selector('[data-test-id="view-implementation-timescales"]');

  await t
    .expect(implementationTimescalesSection.exists).ok()
    .expect(await extractInnerText(implementationTimescalesSection.find('h3'))).eql('Implementation timescales')
    .expect(await extractInnerText(implementationTimescalesSection.find('[data-test-id="view-question-data-text-description"]'))).eql('Implementations without transition from another Catalogue Solution typically take 3-5 working days, the average is 4. The extent of your configuration requirements will have the greatest impact on these timescales. Your main responsibility will be configuration planning and approval.');
});

test('Client application type - browser-based section should be rendered', async (t) => {
  await pageSetup(t, true);
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
    .expect(await extractInnerText(clientApplicationTypesSection.find('h3'))).eql('Client application type')

    .expect(browserBasedExpandableSection.exists).ok()
    .expect(await extractInnerText(browserBasedExpandableSection)).eql('Browser-based application')
    .expect(browserBasedExpandableSection.find('details[open]').exists).notOk()
    .click(browserBasedExpandableSection.find('summary'))
    .expect(browserBasedExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(supportedBrowsersRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Supported browser types')
    .expect(await extractInnerText(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Google Chrome')
    .expect(await extractInnerText(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Mozilla Firefox')
    .expect(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(mobileResponsiveRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Mobile responsive')
    .expect(await extractInnerText(mobileResponsiveRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Yes')
    .expect(mobileResponsiveRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(mobileFirstRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Mobile first approach')
    .expect(await extractInnerText(mobileFirstRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Yes')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(pluginsRequiredRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Plug-ins or extensions required')
    .expect(await extractInnerText(pluginsRequiredRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Yes')
    .expect(pluginsRequiredRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(pluginsDetailRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Additional information about plug-ins or extensions')
    .expect(await extractInnerText(pluginsDetailRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('The plugin detail')
    .expect(pluginsDetailRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(minimumConnectionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Minimum connection speed')
    .expect(await extractInnerText(minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('1Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumResolutionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Screen resolution and aspect ratio')
    .expect(await extractInnerText(minimumResolutionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('4:3 800 x 600')
    .expect(minimumResolutionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(hardwareRequirementsDescriptionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Hardware requirements')
    .expect(await extractInnerText(hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Some hardware requirement description')
    .expect(hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(additionalInformationRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Additional information')
    .expect(await extractInnerText(additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Some browser additional information')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('Client application type - native-mobile section should be rendered', async (t) => {
  await pageSetup(t, true);

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
  const thirdPartyComponentsRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-third-party-components"]');
  const deviceCapabilitiesRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-device-capabilities"]');
  const hardwareRequirementsRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-hardware-requirements"]');
  const additionalInformationRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-additional-information"]');

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(await extractInnerText(clientApplicationTypesSection.find('h3'))).eql('Client application type')

    .expect(nativeMobileExpandableSection.exists).ok()
    .expect(await extractInnerText(nativeMobileExpandableSection)).eql('Native mobile or tablet application')
    .expect(nativeMobileExpandableSection.find('details[open]').exists).notOk()
    .click(nativeMobileExpandableSection.find('summary'))
    .expect(nativeMobileExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(operatingSystemRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Supported operating systems')
    .expect(await extractInnerText(operatingSystemRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Apple')
    .expect(await extractInnerText(operatingSystemRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Android')
    .expect(await extractInnerText(operatingSystemRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Other')
    .expect(operatingSystemRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(operatingSystemDescriptionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Description of supported operating systems')
    .expect(await extractInnerText(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Android 4.1 and above, IOS 10.6 and above.')
    .expect(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(mobileFirstRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Mobile first approach')
    .expect(await extractInnerText(mobileFirstRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Yes')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumMemoryRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Memory size')
    .expect(await extractInnerText(minimumMemoryRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('4GB')
    .expect(minimumMemoryRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(storageDescriptionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Storage space')
    .expect(await extractInnerText(storageDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('You will need at least 4GB of free space on each device the application is installed. It is advised to use an external SD card for additional storage.')
    .expect(storageDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumConnectionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Minimum connection speed')
    .expect(await extractInnerText(minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('1Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(connectionRequirementsRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Connection types supported')
    .expect(await extractInnerText(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('GPRS')
    .expect(await extractInnerText(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('3G')
    .expect(await extractInnerText(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('4G')
    .expect(await extractInnerText(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).contains('Wifi')
    .expect(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(connectionDescriptionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Connection requirements')
    .expect(await extractInnerText(connectionDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Average data usage will vary depending on application activity.')
    .expect(connectionDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(thirdPartyComponentsRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Third-party components')
    .expect(await extractInnerText(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('The application supports and requires an authenticator on each device the application is installed. You will need a software-based authenticator that implements a two-step verification service.')
    .expect(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(deviceCapabilitiesRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Device capabilities')
    .expect(await extractInnerText(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('In order to use our file hosting services, the application will require permission to access device storage.')
    .expect(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(hardwareRequirementsRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Hardware requirements')
    .expect(await extractInnerText(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('To fully utilise our print functionality within the application, you will need a WiFi or Bluetooth connected printer to connect and print documents straight from the device.')
    .expect(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(additionalInformationRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Additional information')
    .expect(await extractInnerText(additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('It is possible that it may install on other platforms or versions not listed in this section. However, support is limited to systems that meet the minimum requirements.')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('Client application type - native-desktop section should be rendered', async (t) => {
  await pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const nativeDesktopExpandableSection = Selector('[data-test-id="view-section-native-desktop"]');
  const nativeDesktopExpandableSectionTable = Selector('[data-test-id="view-section-table-native-desktop"]');
  const operatingSystemDescriptionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-operating-systems-description"]');
  const minimumConnectionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-minimum-connection-speed"]');
  const minimumMemoryRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-minimum-memory-requirement"]');
  const storageDescriptionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-storage-requirements-description"]');
  const minimumCPURow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-minimum-cpu"]');
  const recommendedResolutionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-recommended-resolution"]');
  const thirdPartyComponentsRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-third-party-components"]');
  const deviceCapabilitiesRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-device-capabilities"]');
  const hardwareRequirementsRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-hardware-requirements"]');
  const additionalInformationRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-additional-information"]');

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(await extractInnerText(clientApplicationTypesSection.find('h3'))).eql('Client application type')

    .expect(nativeDesktopExpandableSection.exists).ok()
    .expect(await extractInnerText(nativeDesktopExpandableSection)).eql('Native desktop application')
    .expect(nativeDesktopExpandableSection.find('details[open]').exists).notOk()
    .click(nativeDesktopExpandableSection.find('summary'))
    .expect(nativeDesktopExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(operatingSystemDescriptionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Supported operating systems')
    .expect(await extractInnerText(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Windows 7 and above.')
    .expect(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(minimumConnectionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Minimum connection speed')
    .expect(await extractInnerText(minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('2Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumMemoryRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Memory size')
    .expect(await extractInnerText(minimumMemoryRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('4GB')
    .expect(minimumMemoryRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(storageDescriptionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Storage space')
    .expect(await extractInnerText(storageDescriptionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('You will need at least 2.5GB of free space on each device the application is installed.')
    .expect(storageDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(minimumCPURow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Processing power')
    .expect(await extractInnerText(minimumCPURow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Intel Core i5-4460 (3.4GHz) Quad-core or Better.')
    .expect(minimumCPURow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(recommendedResolutionRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Screen resolution and aspect ratio')
    .expect(await extractInnerText(recommendedResolutionRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('16:9 - 1920 x 1080')
    .expect(recommendedResolutionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(await extractInnerText(thirdPartyComponentsRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Third-party components')
    .expect(await extractInnerText(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('To fully utilise the letter template functionality, you will need a fully licensed version of Microsoft Word 2013 or higher.')
    .expect(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(deviceCapabilitiesRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Device capabilities')
    .expect(await extractInnerText(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('In order to use our branded wireless Dictaphone, the device will require Bluetooth.')
    .expect(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(hardwareRequirementsRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Hardware requirements')
    .expect(await extractInnerText(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('To fully utilise the transcribing functionality within the application, you will need to purchase our branded wireless Dictaphone.')
    .expect(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(additionalInformationRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Additional information')
    .expect(await extractInnerText(additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('It is possible that it may install on other platforms or versions not listed in this section. However, support is limited to systems that meet the minimum requirements.')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('Hosting type - public cloud section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypePublicCloudExpandableSection = Selector('[data-test-id="view-section-hosting-type-public-cloud"]');
  const hostingTypePublicCloudExpandableSectionTable = Selector('[data-test-id="view-section-hosting-type-public-cloud"]');

  const summaryRow = hostingTypePublicCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-summary"]');
  const requiresHSCNRow = hostingTypePublicCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-requires-hscn"]');

  await t
    .expect(hostingTypesSection.exists).ok()
    .expect(await extractInnerText(hostingTypesSection.find('h3'))).eql('Hosting type')

    .expect(hostingTypePublicCloudExpandableSection.exists).ok()
    .expect(await extractInnerText(hostingTypePublicCloudExpandableSection)).eql('Public cloud')
    .expect(hostingTypePublicCloudExpandableSection.find('details[open]').exists).notOk()
    .click(hostingTypePublicCloudExpandableSection.find('summary'))
    .expect(hostingTypePublicCloudExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(summaryRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-summary"]'))).eql('Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-link"]'))).eql('www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting')
    .expect(summaryRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(requiresHSCNRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('This Solution requires a HSCN/N3 connection')
    .expect(requiresHSCNRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('Hosting type - private cloud section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypePrivateCloudExpandableSection = Selector('[data-test-id="view-section-hosting-type-private-cloud"]');
  const hostingTypePrivateCloudExpandableSectionTable = Selector('[data-test-id="view-section-hosting-type-private-cloud"]');

  const summaryRow = hostingTypePrivateCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-summary"]');
  const hostingModelRow = hostingTypePrivateCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-hosting-model"]');
  const requiresHSCNRow = hostingTypePrivateCloudExpandableSectionTable.find('[data-test-id="view-section-table-row-requires-hscn"]');

  await t
    .expect(hostingTypesSection.exists).ok()
    .expect(await extractInnerText(hostingTypesSection.find('h3'))).eql('Hosting type')

    .expect(hostingTypePrivateCloudExpandableSection.exists).ok()
    .expect(await extractInnerText(hostingTypePrivateCloudExpandableSection)).eql('Private cloud')
    .expect(hostingTypePrivateCloudExpandableSection.find('details[open]').exists).notOk()
    .click(hostingTypePrivateCloudExpandableSection.find('summary'))
    .expect(hostingTypePrivateCloudExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(summaryRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-summary"]'))).eql('Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-link"]'))).eql('www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting')
    .expect(summaryRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(hostingModelRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Data center hosting model')
    .expect(await extractInnerText(hostingModelRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Our managed data center is hosted in two separate geographical locations, they both comply to the highest standards to ensure that even if one of our data centers suffers an outage, we can ensure that your daily activities are not interrupted. We also create a back up of all of our data every evening and store it separately, so in the result of any catastrophic failure, we can ensure that patient confidential information is kept secure.')
    .expect(hostingModelRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(requiresHSCNRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('This Solution requires a HSCN/N3 connection')
    .expect(requiresHSCNRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('Hosting type - hybrid section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypeHybridExpandableSection = Selector('[data-test-id="view-section-hosting-type-hybrid"]');
  const hostingTypeHybridExpandableSectionTable = Selector('[data-test-id="view-section-hosting-type-hybrid"]');
  const summaryRow = hostingTypeHybridExpandableSectionTable.find('[data-test-id="view-section-table-row-summary"]');
  const hostingModelRow = hostingTypeHybridExpandableSectionTable.find('[data-test-id="view-section-table-row-hosting-model"]');
  const requiresHSCNRow = hostingTypeHybridExpandableSectionTable.find('[data-test-id="view-section-table-row-requires-hscn"]');

  await t
    .expect(hostingTypesSection.exists).ok()
    .expect(await extractInnerText(hostingTypesSection.find('h3'))).eql('Hosting type')

    .expect(hostingTypeHybridExpandableSection.exists).ok()
    .expect(await extractInnerText(hostingTypeHybridExpandableSection)).eql('Hybrid')
    .expect(hostingTypeHybridExpandableSection.find('details[open]').exists).notOk()
    .click(hostingTypeHybridExpandableSection.find('summary'))
    .expect(hostingTypeHybridExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(summaryRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-summary"]'))).eql('Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-link"]'))).eql('www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting')
    .expect(summaryRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(hostingModelRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Data center hosting model')
    .expect(await extractInnerText(hostingModelRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Our managed data center is hosted in two separate geographical locations, they both comply to the highest standards to ensure that even if one of our data centers suffers an outage, we can ensure that your daily activities are not interrupted. We also create a back up of all of our data every evening and store it separately, so in the result of any catastrophic failure, we can ensure that patient confidential information is kept secure.')
    .expect(hostingModelRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(requiresHSCNRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('This Solution requires a HSCN/N3 connection')
    .expect(requiresHSCNRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('Hosting type - on premise section should be rendered', async (t) => {
  await pageSetup(t, true);

  const hostingTypesSection = Selector('[data-test-id="view-hosting-types"]');
  const hostingTypeOnPremiseExpandableSection = Selector('[data-test-id="view-section-hosting-type-on-premise"]');
  const hostingTypeOnPremiseExpandableSectionTable = Selector('[data-test-id="view-section-hosting-type-on-premise"]');
  const summaryRow = hostingTypeOnPremiseExpandableSectionTable.find('[data-test-id="view-section-table-row-summary"]');
  const hostingModelRow = hostingTypeOnPremiseExpandableSectionTable.find('[data-test-id="view-section-table-row-hosting-model"]');
  const requiresHSCNRow = hostingTypeOnPremiseExpandableSectionTable.find('[data-test-id="view-section-table-row-requires-hscn"]');

  await t
    .expect(hostingTypesSection.exists).ok()
    .expect(await extractInnerText(hostingTypesSection.find('h3'))).eql('Hosting type')

    .expect(hostingTypeOnPremiseExpandableSection.exists).ok()
    .expect(await extractInnerText(hostingTypeOnPremiseExpandableSection)).eql('On premise')
    .expect(hostingTypeOnPremiseExpandableSection.find('details[open]').exists).notOk()
    .click(hostingTypeOnPremiseExpandableSection.find('summary'))
    .expect(hostingTypeOnPremiseExpandableSection.find('details[open]').exists).ok()

    .expect(await extractInnerText(summaryRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Summary')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-summary"]'))).eql('Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.')
    .expect(await extractInnerText(summaryRow.find('div[data-test-id="view-question-data-text-link"]'))).eql('www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting')
    .expect(summaryRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(hostingModelRow.find('h4[data-test-id="view-section-table-row-title"]'))).eql('Data center hosting model')
    .expect(await extractInnerText(hostingModelRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('Our managed data center is hosted in two separate geographical locations, they both comply to the highest standards to ensure that even if one of our data centers suffers an outage, we can ensure that your daily activities are not interrupted. We also create a back up of all of our data every evening and store it separately, so in the result of any catastrophic failure, we can ensure that patient confidential information is kept secure.')
    .expect(hostingModelRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(await extractInnerText(requiresHSCNRow.find('div[data-test-id="view-section-table-row-component"]'))).eql('This Solution requires a HSCN/N3 connection')
    .expect(requiresHSCNRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('About supplier section and all questions should be rendered', async (t) => {
  await pageSetup(t, true);

  const aboutSupplierSection = Selector('[data-test-id="view-about-supplier"]');
  const descriptionQuestion = aboutSupplierSection.find('[data-test-id="view-section-question-description"]');
  const linkQuestion = aboutSupplierSection.find('[data-test-id="view-section-question-link"]');

  await t
    .expect(aboutSupplierSection.exists).ok()
    .expect(await extractInnerText(aboutSupplierSection.find('h3'))).eql('About supplier')

    .expect(descriptionQuestion.exists).ok()
    .expect(descriptionQuestion.find('[data-test-id="view-question-title"]').exists).notOk()
    .expect(await extractInnerText(descriptionQuestion.find('[data-test-id="view-question-data-text-description"]'))).eql('The supplier description data')

    .expect(linkQuestion.exists).ok()
    .expect(linkQuestion.find('[data-test-id="view-question-title"]').exists).notOk()
    .expect(await extractInnerText(linkQuestion.find('[data-test-id="view-question-data-link"]'))).eql('http://www.supplier.com');
});

test('Contact-details section should be rendered', async (t) => {
  await pageSetup(t, true);

  const contactDetailsSection = Selector('[data-test-id="view-solution-contact-details"]');
  const contact1Details = contactDetailsSection.find('[data-test-id="view-section-question-contact-1"]');
  const contact1DepartmentName = contact1Details.find('[data-test-id="view-question-data-text-department-name"]');
  const contact1ContactName = contact1Details.find('[data-test-id="view-question-data-text-contact-name"]');
  const contact1PhoneNumber = contact1Details.find('[data-test-id="view-question-data-text-phone-number"]');
  const contact1EmailAddress = contact1Details.find('[data-test-id="view-question-data-text-email-address"]');

  const contact2Details = contactDetailsSection.find('[data-test-id="view-section-question-contact-2"]');
  const contact2DepartmentName = contact2Details.find('[data-test-id="view-question-data-text-department-name"]');
  const contact2ContactName = contact2Details.find('[data-test-id="view-question-data-text-contact-name"]');
  const contact2PhoneNumber = contact2Details.find('[data-test-id="view-question-data-text-phone-number"]');
  const contact2EmailAddress = contact2Details.find('[data-test-id="view-question-data-text-email-address"]');

  await t
    .expect(contactDetailsSection.exists).ok()
    .expect(await extractInnerText(contactDetailsSection.find('h3'))).eql('Contact details')

    .expect(contact1Details.exists).ok()
    .expect(await extractInnerText(contact1DepartmentName)).eql('One Department')
    .expect(await extractInnerText(contact1ContactName)).eql('Contact One')
    .expect(await extractInnerText(contact1PhoneNumber)).eql('111111111')
    .expect(await extractInnerText(contact1EmailAddress)).eql('contact@one.com')

    .expect(contact2Details.exists).ok()
    .expect(await extractInnerText(contact2DepartmentName)).eql('Two Department')
    .expect(await extractInnerText(contact2ContactName)).eql('Contact Two')
    .expect(await extractInnerText(contact2PhoneNumber)).eql('222222222')
    .expect(await extractInnerText(contact2EmailAddress)).eql('contact@two.com');
});

test('Roadmap section should be rendered', async (t) => {
  await pageSetup(t, true);

  const roadmapSection = Selector('[data-test-id="view-roadmap"]');
  const summaryQuestion = roadmapSection.find('[data-test-id="view-section-question-summary"]');
  const documentLink = roadmapSection.find('[data-test-id="view-section-question-document-link"]');

  await t
    .expect(roadmapSection.exists).ok()
    .expect(await extractInnerText(roadmapSection.find('h3'))).eql('Roadmap')

    .expect(summaryQuestion.exists).ok()
    .expect(await extractInnerText(summaryQuestion.find('[data-test-id="view-question-data-text-summary"]'))).eql('The roadmap summary details')

    .expect(documentLink.exists).ok()
    .expect(await extractInnerText(documentLink.find('[data-test-id="view-question-data-link-document-link"]'))).eql('View roadmap')
    .expect(documentLink.find('[data-test-id="view-question-data-link-document-link"] > a').getAttribute('href')).eql('document/roadmap.pdf');
});

test('Learn More section should be rendered', async (t) => {
  await pageSetup(t, true);

  const learnMoreSection = Selector('[data-test-id="view-learn-more"]');
  const documentLink = learnMoreSection.find('[data-test-id="view-section-question-document-link"] a');

  await t
    .expect(learnMoreSection.exists).ok()
    .expect(await extractInnerText(learnMoreSection.find('h3'))).eql('Learn more')

    .expect(documentLink.exists).ok()
    .expect(await extractInnerText(documentLink)).eql('Download PDF')
    .expect(documentLink.getAttribute('href')).eql('document/solution.pdf');
});
