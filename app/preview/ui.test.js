import nock from 'nock';
import { Selector } from 'testcafe';
import previewWithNoMarketingData from '../../fixtures/previewWithNoMarketingData.json';
import previewWithMarketingData from '../../fixtures/previewWithMarketingData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../test-utils/config';

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
  await t.navigateTo(`${clientLocalhost}/preview`);
};

fixture('Show marketing preview page');

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
  await pageSetup(t, true);

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

test('when existing marketing data - The features section should be rendered and the features displayed', async (t) => {
  await pageSetup(t, true);

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
  await pageSetup(t, true);
  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const browserBasedExpandableSection = Selector('[data-test-id="view-section-browser-based"]');
  const browserBasedExpandableSectionText = await browserBasedExpandableSection.innerText;
  const browserBasedExpandaleSectionTable = Selector('[data-test-id="view-section-table-browser-based"]');
  const supportedBrowsersRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-supported-browsers"]');
  const supportedBrowsersRowTitle = await supportedBrowsersRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const supportedBrowsersRowItems = await supportedBrowsersRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const mobileResponsiveRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-mobile-responsive"]');
  const mobileResponsiveRowTitle = await mobileResponsiveRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const mobileResponsiveRowItems = await mobileResponsiveRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const mobileFirstRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-mobile-first-design"]');
  const mobileFirstRowTitle = await mobileFirstRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const mobileFirstRowItems = await mobileFirstRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const pluginsRequiredRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-plugins-required"]');
  const pluginsRequiredRowTitle = await pluginsRequiredRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const pluginsRequiredRowItems = await pluginsRequiredRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const pluginsDetailRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-plugins-detail"]');
  const pluginsDetailRowTitle = await pluginsDetailRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const pluginsDetailRowItems = await pluginsDetailRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const minimumConnectionRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-connection-speed"]');
  const minimumConnectionRowTitle = await minimumConnectionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const minimumConnectionRowItems = await minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const minimumResolutionRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-desktop-resolution"]');
  const minimumResolutionRowTitle = await minimumResolutionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const minimumResolutionRowItems = await minimumResolutionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const hardwareRequirementsDescriptionRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-hardware-requirements-description"]');
  const hardwareRequirementsDescriptionRowTitle = await hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const hardwareRequirementsDescriptionRowItems = await hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const additionalInformationRow = browserBasedExpandaleSectionTable.find('[data-test-id="view-section-table-row-additional-information"]');
  const additionalInformationRowTitle = await additionalInformationRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const additionalInformationRowItems = await additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(clientApplicationTypesSection.find('h3').innerText).eql('Client application type')

    .expect(browserBasedExpandableSection.exists).ok()
    .expect(browserBasedExpandableSectionText.trim()).eql('Browser based application')
    .expect(browserBasedExpandableSection.find('details[open]').exists).notOk()
    .click(browserBasedExpandableSection.find('summary'))
    .expect(browserBasedExpandableSection.find('details[open]').exists).ok()

    .expect(supportedBrowsersRowTitle.trim()).eql('Browsers Supported')
    .expect(supportedBrowsersRowItems).contains('Google Chrome')
    .expect(supportedBrowsersRowItems).contains('Mozilla Firefox')
    .expect(supportedBrowsersRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(mobileResponsiveRowTitle.trim()).eql('Mobile responsive')
    .expect(mobileResponsiveRowItems.trim()).eql('Yes')
    .expect(mobileResponsiveRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(mobileFirstRowTitle.trim()).eql('Designed with a mobile first approach')
    .expect(mobileFirstRowItems.trim()).eql('Yes')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(pluginsRequiredRowTitle.trim()).eql('Plug-ins or extensions required')
    .expect(pluginsRequiredRowItems.trim()).eql('Yes')
    .expect(pluginsRequiredRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(pluginsDetailRowTitle.trim()).eql('Plug-ins or extensions information')
    .expect(pluginsDetailRowItems.trim()).eql('The plugin detail')
    .expect(pluginsDetailRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumConnectionRowTitle.trim()).eql('Minimum connection speed required')
    .expect(minimumConnectionRowItems.trim()).eql('1Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumResolutionRowTitle.trim()).eql('Recommended desktop aspect ratio and screen resolution')
    .expect(minimumResolutionRowItems.trim()).eql('4:3 800 x 600')
    .expect(minimumResolutionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(hardwareRequirementsDescriptionRowTitle.trim()).eql('Hardware requirements')
    .expect(hardwareRequirementsDescriptionRowItems.trim()).eql('Some hardware requirement description')
    .expect(hardwareRequirementsDescriptionRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(additionalInformationRowTitle.trim()).eql('Additional information')
    .expect(additionalInformationRowItems.trim()).eql('Some browser additional information')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok();
});

test('when existing marketing data - The client application type section and native-mobile section should be rendered', async (t) => {
  await pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const nativeMobileExpandableSection = Selector('[data-test-id="view-section-native-mobile"]');
  const nativeMobileExpandableSectionText = await nativeMobileExpandableSection.innerText;
  const nativeMobileExpandaleSectionTable = Selector('[data-test-id="view-section-table-native-mobile"]');
  const operatingSystemRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-operating-systems"]');
  const operatingSystemRowTitle = await operatingSystemRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const operatingSystemRowItems = await operatingSystemRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const operatingSystemDescriptionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-operating-systems-description"]');
  const operatingSystemDescriptionRowTitle = await operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const operatingSystemDescriptionRowItems = await operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const mobileFirstRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-mobile-first-design"]');
  const mobileFirstRowTitle = await mobileFirstRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const mobileFirstRowItems = await mobileFirstRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const minimumMemoryRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-memory-requirement"]');
  const minimumMemoryRowTitle = await minimumMemoryRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const minimumMemoryRowItems = await minimumMemoryRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const storageDescriptionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-storage-requirements-description"]');
  const storageDescriptionRowTitle = await storageDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const storageDescriptionRowItems = await storageDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const minimumConnectionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-minimum-connection-speed"]');
  const minimumConnectionRowTitle = await minimumConnectionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const minimumConnectionRowItems = await minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const connectionRequirementsRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-connection-types"]');
  const connectionRequirementsRowTitle = await connectionRequirementsRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const connectionRequirementsRowItems = await connectionRequirementsRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const connectionDescriptionRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-connection-requirements-description"]');
  const connectionDescriptionRowTitle = await connectionDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const connectionDescriptionRowItems = await connectionDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const thirdPartyComponentsRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-third-party-components"]');
  const thirdPartyComponentsRowTitle = await thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const thirdPartyComponentsRowItems = await thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const deviceCapabilitiesRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-device-capabilities"]');
  const deviceCapabilitiesRowTitle = await deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const deviceCapabilitiesRowItems = await deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const hardwareRequirementsRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-hardware-requirements"]');
  const hardwareRequirementsRowTitle = await hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const hardwareRequirementsRowItems = await hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const additionalInformationRow = nativeMobileExpandaleSectionTable.find('[data-test-id="view-section-table-row-additional-information"]');
  const additionalInformationRowTitle = await additionalInformationRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const additionalInformationRowItems = await additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]').innerText;

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(clientApplicationTypesSection.find('h3').innerText).eql('Client application type')

    .expect(nativeMobileExpandableSection.exists).ok()
    .expect(nativeMobileExpandableSectionText.trim()).eql('Native mobile or tablet application')
    .expect(nativeMobileExpandableSection.find('details[open]').exists).notOk()
    .click(nativeMobileExpandableSection.find('summary'))
    .expect(nativeMobileExpandableSection.find('details[open]').exists).ok()

    .expect(operatingSystemRowTitle.trim()).eql('Supported operating systems')
    .expect(operatingSystemRowItems).contains('Apple')
    .expect(operatingSystemRowItems).contains('Android')
    .expect(operatingSystemRowItems).contains('Other')
    .expect(operatingSystemRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(operatingSystemDescriptionRowTitle.trim()).eql('Additional operating system information')
    .expect(operatingSystemDescriptionRowItems.trim()).eql('Android 4.1 and above, IOS 10.6 and above.')
    .expect(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-vertical"]').exists).ok()

    .expect(mobileFirstRowTitle.trim()).eql('Designed with a mobile first approach')
    .expect(mobileFirstRowItems.trim()).eql('Yes')
    .expect(mobileFirstRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumMemoryRowTitle.trim()).eql('Minimum memory requirement')
    .expect(minimumMemoryRowItems.trim()).eql('4GB')
    .expect(minimumMemoryRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(storageDescriptionRowTitle.trim()).eql('Additional storage requirements')
    .expect(storageDescriptionRowItems.trim()).eql('You will need at least 4GB of free space on each device the application is installed. It is advised to use an external SD card for additional storage.')
    .expect(storageDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumConnectionRowTitle.trim()).eql('Minimum connection speed required')
    .expect(minimumConnectionRowItems.trim()).eql('1Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(connectionRequirementsRowTitle.trim()).eql('Connection types supported')
    .expect(connectionRequirementsRowItems).contains('GPRS')
    .expect(connectionRequirementsRowItems).contains('3G')
    .expect(connectionRequirementsRowItems).contains('4G')
    .expect(connectionRequirementsRowItems).contains('Wifi')
    .expect(connectionRequirementsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(connectionDescriptionRowTitle.trim()).eql('Additional information about connection types')
    .expect(connectionDescriptionRowItems.trim()).eql('Average data usage will vary depending on application activity.')
    .expect(connectionDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(thirdPartyComponentsRowTitle.trim()).eql('Third party components required')
    .expect(thirdPartyComponentsRowItems.trim()).eql('The application supports and requires an authenticator on each device the application is installed. You will need a software-based authenticator that implements a two-step verification service.')
    .expect(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(deviceCapabilitiesRowTitle.trim()).eql('Device capabilities required')
    .expect(deviceCapabilitiesRowItems.trim()).eql('In order to use our file hosting services, the application will require permission to access device storage.')
    .expect(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(hardwareRequirementsRowTitle.trim()).eql('Hardware requirements')
    .expect(hardwareRequirementsRowItems.trim()).eql('To fully utilise our print functionality within the application, you will need a WiFi or Bluetooth connected printer to connect and print documents straight from the device.')
    .expect(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(additionalInformationRowTitle.trim()).eql('Additional information')
    .expect(additionalInformationRowItems.trim()).eql('It is possible that it may install on other platforms or versions not listed in this section. However, support is limited to systems that meet the minimum requirements.')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok();
});

test('when existing marketing data - The client application type section and native-desktop section should be rendered', async (t) => {
  await pageSetup(t, true);

  const clientApplicationTypesSection = Selector('[data-test-id="view-client-application-types"]');
  const nativeDesktopExpandableSection = Selector('[data-test-id="view-section-native-desktop"]');
  const nativeDesktopExpandableSectionText = await nativeDesktopExpandableSection.innerText;
  const nativeDesktopExpandableSectionTable = Selector('[data-test-id="view-section-table-native-desktop"]');
  const operatingSystemDescriptionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-operating-systems-description"]');
  const operatingSystemDescriptionRowTitle = await operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const operatingSystemDescriptionRowItems = await operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const minimumConnectionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-minimum-connection-speed"]');
  const minimumConnectionRowTitle = await minimumConnectionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const minimumConnectionRowItems = await minimumConnectionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const minimumMemoryRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-minimum-memory-requirement"]');
  const minimumMemoryRowTitle = await minimumMemoryRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const minimumMemoryRowItems = await minimumMemoryRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const storageDescriptionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-storage-requirements-description"]');
  const storageDescriptionRowTitle = await storageDescriptionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const storageDescriptionRowItems = await storageDescriptionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const minimumCPURow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-minimum-cpu"]');
  const minimumCPURowTitle = await minimumCPURow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const minimumCPURowItems = await minimumCPURow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const recommendedResolutionRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-recommended-resolution"]');
  const recommendedResolutionRowTitle = await recommendedResolutionRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const recommendedResolutionRowItems = await recommendedResolutionRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const thirdPartyComponentsRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-third-party-components"]');
  const thirdPartyComponentsRowTitle = await thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const thirdPartyComponentsRowItems = await thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const deviceCapabilitiesRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-device-capabilities"]');
  const deviceCapabilitiesRowTitle = await deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const deviceCapabilitiesRowItems = await deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const hardwareRequirementsRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-hardware-requirements"]');
  const hardwareRequirementsRowTitle = await hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const hardwareRequirementsRowItems = await hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-component"]').innerText;
  const additionalInformationRow = nativeDesktopExpandableSectionTable.find('[data-test-id="view-section-table-row-additional-information"]');
  const additionalInformationRowTitle = await additionalInformationRow.find('div[data-test-id="view-section-table-row-title"]').innerText;
  const additionalInformationRowItems = await additionalInformationRow.find('div[data-test-id="view-section-table-row-component"]').innerText;

  await t
    .expect(clientApplicationTypesSection.exists).ok()
    .expect(clientApplicationTypesSection.find('h3').innerText).eql('Client application type')

    .expect(nativeDesktopExpandableSection.exists).ok()
    .expect(nativeDesktopExpandableSectionText.trim()).eql('Native desktop application')
    .expect(nativeDesktopExpandableSection.find('details[open]').exists).notOk()
    .click(nativeDesktopExpandableSection.find('summary'))
    .expect(nativeDesktopExpandableSection.find('details[open]').exists).ok()

    .expect(operatingSystemDescriptionRowTitle.trim()).eql('Supported operating systems')
    .expect(operatingSystemDescriptionRowItems.trim()).eql('Windows 7 and above.')
    .expect(operatingSystemDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumConnectionRowTitle.trim()).eql('Minimum connection speed required')
    .expect(minimumConnectionRowItems.trim()).eql('2Mbps')
    .expect(minimumConnectionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumMemoryRowTitle.trim()).eql('Minimum memory requirement')
    .expect(minimumMemoryRowItems.trim()).eql('4GB')
    .expect(minimumMemoryRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(storageDescriptionRowTitle.trim()).eql('Additional storage requirements')
    .expect(storageDescriptionRowItems.trim()).eql('You will need at least 2.5GB of free space on each device the application is installed.')
    .expect(storageDescriptionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(minimumCPURowTitle.trim()).eql('Minimum necessary CPU power')
    .expect(minimumCPURowItems.trim()).eql('Intel Core i5-4460 (3.4GHz) Quad-core or Better.')
    .expect(minimumCPURow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(recommendedResolutionRowTitle.trim()).eql('Recommended desktop aspect ratio and screen resolution')
    .expect(recommendedResolutionRowItems.trim()).eql('16:9 - 1920 x 1080')
    .expect(recommendedResolutionRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(thirdPartyComponentsRowTitle.trim()).eql('Third party components required')
    .expect(thirdPartyComponentsRowItems.trim()).eql('To fully utilise the letter template functionality, you will need a fully licensed version of Microsoft Word 2013 or higher.')
    .expect(thirdPartyComponentsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(deviceCapabilitiesRowTitle.trim()).eql('Device capabilities required')
    .expect(deviceCapabilitiesRowItems.trim()).eql('In order to use our branded wireless Dictaphone, the device will require Bluetooth.')
    .expect(deviceCapabilitiesRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(hardwareRequirementsRowTitle.trim()).eql('Hardware requirements')
    .expect(hardwareRequirementsRowItems.trim()).eql('To fully utilise the transcribing functionality within the application, you will need to purchase our branded wireless Dictaphone.')
    .expect(hardwareRequirementsRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok()

    .expect(additionalInformationRowTitle.trim()).eql('Additional information')
    .expect(additionalInformationRowItems.trim()).eql('It is possible that it may install on other platforms or versions not listed in this section. However, support is limited to systems that meet the minimum requirements.')
    .expect(additionalInformationRow.find('div[data-test-id="view-section-table-row-horizontal"]').exists).ok();
});
