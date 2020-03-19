import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithCompleteSections from '../../../../../../fixtures/dashboardWithCompleteSections.json';
import nativeDesktopFixture from './fixtureData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../../../../../test-utils/config';
import { extractInnerText } from '../../../../../test-utils/helper';

const mocks = async () => {
  await nock(apiLocalhost)
    .get(`${apiPath}/dashboards/native-desktop`)
    .reply(200, nativeDesktopFixture);
};

const pageSetup = async (t) => {
  await mocks();
  await t.navigateTo(`${clientLocalhost}/supplier/solution/S100000-001/dashboard/native-desktop`);
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Show native desktop dashboard page');

test('should render the native desktop dashboard page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="sub-dashboard-title"]');

  await t
    .expect(await extractInnerText(title)).eql('Native desktop application – all sections');
});

test('should render the native desktop dashboard main advice', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="sub-dashboard-main-advice"]');

  await t
    .expect(await extractInnerText(mainAdvice)).eql('Provide information about your native desktop Catalogue Solution.');
});

test('should render native desktop section group', async (t) => {
  await pageSetup(t);

  const nativeDesktopSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-native-desktop-sections"]');

  await t
    .expect(await extractInnerText(nativeDesktopSectionGroup.find('h2'))).eql('Native desktop information');
});

test('should render all the sections for native mobile sections section group', async (t) => {
  await pageSetup(t);

  const nativeDesktopSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-native-desktop-sections"]');
  const supportedOperatingSystems = nativeDesktopSectionGroup.find('[data-test-id="dashboard-section-native-desktop-operating-systems"]');
  const connectionDetails = nativeDesktopSectionGroup.find('[data-test-id="dashboard-section-native-desktop-connection-details"]');
  const memoryAndStorage = nativeDesktopSectionGroup.find('[data-test-id="dashboard-section-native-desktop-memory-and-storage"]');
  const thirdParty = nativeDesktopSectionGroup.find('[data-test-id="dashboard-section-native-desktop-third-party"]');
  const hardwareRequirements = nativeDesktopSectionGroup.find('[data-test-id="dashboard-section-native-desktop-hardware-requirements"]');
  const additionalInformation = nativeDesktopSectionGroup.find('[data-test-id="dashboard-section-native-desktop-additional-information"]');

  await t
    .expect(await extractInnerText(supportedOperatingSystems.find('[data-test-id="dashboard-section-title"]')))
    .eql('Supported operating systems')
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-desktop/section/native-desktop-operating-systems')
    .expect(await extractInnerText(supportedOperatingSystems.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(supportedOperatingSystems.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(connectionDetails.find('[data-test-id="dashboard-section-title"]')))
    .eql('Connectivity')
    .expect(connectionDetails.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-desktop/section/native-desktop-connection-details')
    .expect(await extractInnerText(connectionDetails.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(connectionDetails.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(memoryAndStorage.find('[data-test-id="dashboard-section-title"]')))
    .eql('Memory, storage, processing and resolution')
    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-desktop/section/native-desktop-memory-and-storage')
    .expect(await extractInnerText(memoryAndStorage.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(memoryAndStorage.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(thirdParty.find('[data-test-id="dashboard-section-title"]')))
    .eql('Third-party components and device capabilities')
    .expect(thirdParty.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-desktop/section/native-desktop-third-party')
    .expect(await extractInnerText(thirdParty.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(thirdParty.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(hardwareRequirements.find('[data-test-id="dashboard-section-title"]')))
    .eql('Hardware requirements')
    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-desktop/section/native-desktop-hardware-requirements')
    .expect(await extractInnerText(hardwareRequirements.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(hardwareRequirements.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(additionalInformation.find('[data-test-id="dashboard-section-title"]')))
    .eql('Additional information')
    .expect(additionalInformation.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-desktop/section/native-desktop-additional-information')
    .expect(await extractInnerText(additionalInformation.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(additionalInformation.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE');
});

test('should navigate the user to supported operating systems page when clicking on supported operating systems dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-operating-systems`)
    .reply(200, {});


  const supportedOperatingSystemsSection = Selector('[data-test-id="dashboard-section-native-desktop-operating-systems"]');

  await t
    .click(supportedOperatingSystemsSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-desktop/section/native-desktop-operating-systems');
});

test('should navigate the user to the connection details page when clicking on the connection details dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-connection-details`)
    .reply(200, {});


  const connectionDetailsSection = Selector('[data-test-id="dashboard-section-native-desktop-connection-details"]');

  await t
    .click(connectionDetailsSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-desktop/section/native-desktop-connection-details');
});

test('should navigate the user to memory and storage page when clicking on memory and storage dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-memory-and-storage`)
    .reply(200, {});


  const memoryAndStorageSection = Selector('[data-test-id="dashboard-section-native-desktop-memory-and-storage"]');

  await t
    .click(memoryAndStorageSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-desktop/section/native-desktop-memory-and-storage');
});

test('should navigate the user to third-party page when clicking on third-party dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-third-party`)
    .reply(200, {});


  const thirdPartySection = Selector('[data-test-id="dashboard-section-native-desktop-third-party"]');

  await t
    .click(thirdPartySection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-desktop/section/native-desktop-third-party');
});

test('should navigate the user to hardware requirements page when clicking on hardware requirements dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-hardware-requirements`)
    .reply(200, {});


  const hardwareRequirementsSection = Selector('[data-test-id="dashboard-section-native-desktop-hardware-requirements"]');

  await t
    .click(hardwareRequirementsSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-desktop/section/native-desktop-hardware-requirements');
});

test('should navigate the user to additional information page when clicking on additional information dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-additional-information`)
    .reply(200, {});


  const additionalInformationSection = Selector('[data-test-id="dashboard-section-native-desktop-additional-information"]');

  await t
    .click(additionalInformationSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-desktop/section/native-desktop-additional-information');
});

test('should render the return to all sections link', async (t) => {
  await pageSetup(t);

  const link = Selector('[data-test-id="sub-dashboard-back-link"] a');

  await t
    .expect(await extractInnerText(link)).eql('Return to all sections');
});

test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/dashboard`)
    .reply(200, dashboardWithCompleteSections);


  const link = Selector('[data-test-id="sub-dashboard-back-link"] div a');

  await t
    .expect(link.exists).ok()
    .click(link)
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('/supplier/solution/S100000-001');
});
