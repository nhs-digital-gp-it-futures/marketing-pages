import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';
import nativeDesktopFixture from './fixtureData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../../../test-utils/config';

const mocks = () => {
  nock(apiLocalhost)
    .get(`${apiPath}/dashboards/native-desktop`)
    .reply(200, nativeDesktopFixture);
};

const pageSetup = async (t) => {
  mocks();
  await t.navigateTo(`${clientLocalhost}/dashboard/native-desktop`);
};

fixture('Show native desktop dashboard page')

test('should render the native desktop dashboard page title', async (t) => {

  await pageSetup(t);

  const title = Selector('[data-test-id="sub-dashboard-title"]');

  await t
    .expect(title.innerText).eql('Native desktop');
});

test('should render the native desktop dashboard main advice', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="sub-dashboard-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add further detail about your native desktop application.');
});

test('should render native desktop section group', async (t) => {
  await pageSetup(t);

  const nativeDesktopSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-native-desktop-sections"]');

  await t
    .expect(nativeDesktopSectionGroup.find('h2').innerText).eql('Native desktop sections');
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
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Supported operating systems')
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-desktop/section/native-desktop-operating-systems')
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(connectionDetails.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Connection details')
    .expect(connectionDetails.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-desktop/section/native-desktop-connection-details')
    .expect(connectionDetails.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(connectionDetails.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Memory, storage, processing and aspect ratio')
    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-desktop/section/native-desktop-memory-and-storage')
    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(thirdParty.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Third party components and device capabilities')
    .expect(thirdParty.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-desktop/section/native-desktop-third-party')
    .expect(thirdParty.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(thirdParty.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Hardware requirements')
    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-desktop/section/native-desktop-hardware-requirements')
    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(additionalInformation.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Additional information')
    .expect(additionalInformation.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-desktop/section/native-desktop-additional-information')
    .expect(additionalInformation.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(additionalInformation.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE');
});

test('should navigate the user to supported operating systems page when clicking on supported operating systems dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-operating-systems`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const supportedOperatingSystemsSection = Selector('[data-test-id="dashboard-section-native-desktop-operating-systems"]');

  await t
    .click(supportedOperatingSystemsSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-desktop/section/native-desktop-operating-systems');
});

test('should navigate the user to the connection details page when clicking on the connection details dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-connection-details`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const connectionDetailsSection = Selector('[data-test-id="dashboard-section-native-desktop-connection-details"]');

  await t
    .click(connectionDetailsSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-desktop/section/native-desktop-connection-details');
});

test('should navigate the user to memory and storage page when clicking on memory and storage dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-memory-and-storage`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const memoryAndStorageSection = Selector('[data-test-id="dashboard-section-native-desktop-memory-and-storage"]');

  await t
    .click(memoryAndStorageSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-desktop/section/native-desktop-memory-and-storage');
});

test('should navigate the user to third party page when clicking on third party dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-third-party`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const thirdPartySection = Selector('[data-test-id="dashboard-section-native-desktop-third-party"]');

  await t
    .click(thirdPartySection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-desktop/section/native-desktop-third-party');
});

test('should navigate the user to hardware requirements page when clicking on hardware requirements dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-hardware-requirements`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const hardwareRequirementsSection = Selector('[data-test-id="dashboard-section-native-desktop-hardware-requirements"]');

  await t
    .click(hardwareRequirementsSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-desktop/section/native-desktop-hardware-requirements');
});

test('should navigate the user to additional information page when clicking on additional information dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-desktop-additional-information`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const additionalInformationSection = Selector('[data-test-id="dashboard-section-native-desktop-additional-information"]');

  await t
    .click(additionalInformationSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-desktop/section/native-desktop-additional-information');
});

test('should render the return to all sections link', async (t) => {
  await pageSetup(t);

  const link = Selector('[data-test-id="sub-dashboard-back-link"] a');
  const linkText = await link.innerText;

  await t
    .expect(linkText.trim()).eql('Return to all sections');
});

test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/dashboard`)
    .reply(200, dashboardWithCompleteSections);

  const getLocation = ClientFunction(() => document.location.href);

  const link = Selector('[data-test-id="sub-dashboard-back-link"] div a');

  await t
    .expect(link.exists).ok()
    .click(link)
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('S100000-001');
});
