import nock from 'nock';
import { extractInnerText } from 'buying-catalogue-library';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithCompleteSections from '../../../../../../fixtures/dashboardWithCompleteSections.json';
import nativeMobileFixture from './fixtureData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../../../../../test-utils/config';

const mocks = () => {
  nock(apiLocalhost)
    .get(`${apiPath}/dashboards/native-mobile`)
    .reply(200, nativeMobileFixture);
};

const pageSetup = async (t) => {
  mocks();
  await t.navigateTo(`${clientLocalhost}/supplier/solution/S100000-001/dashboard/native-mobile`);
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Show native mobile dashboard page');

test('should render the native mobile dashboard page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="sub-dashboard-title"]');

  await t
    .expect(await extractInnerText(title)).eql('Native mobile or tablet application – all sections');
});

test('should render the native mobile dashboard main advice', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="sub-dashboard-main-advice"]');

  await t
    .expect(await extractInnerText(mainAdvice)).eql('Provide information about your native mobile or tablet Catalogue Solution.');
});

test('should render native mobile section group', async (t) => {
  await pageSetup(t);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-native-mobile-sections"]');

  await t
    .expect(await extractInnerText(browserBasedSectionGroup.find('h2'))).eql('Native mobile or tablet sections');
});

test('should render all the sections for native mobile sections section group', async (t) => {
  await pageSetup(t);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-native-mobile-sections"]');
  const supportedOperatingSystems = browserBasedSectionGroup.find('[data-test-id="dashboard-section-native-mobile-operating-systems"]');
  const mobileFirstSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-native-mobile-first"]');
  const memoryAndStorage = browserBasedSectionGroup.find('[data-test-id="dashboard-section-native-mobile-memory-and-storage"]');
  const connectionDetails = browserBasedSectionGroup.find('[data-test-id="dashboard-section-native-mobile-connection-details"]');
  const thirdParty = browserBasedSectionGroup.find('[data-test-id="dashboard-section-native-mobile-third-party"]');
  const hardwareRequirements = browserBasedSectionGroup.find('[data-test-id="dashboard-section-native-mobile-hardware-requirements"]');
  const additionalInformation = browserBasedSectionGroup.find('[data-test-id="dashboard-section-native-mobile-additional-information"]');

  await t
    .expect(await extractInnerText(supportedOperatingSystems.find('[data-test-id="dashboard-section-title"]')))
    .eql('Supported operating systems')
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-mobile/section/native-mobile-operating-systems')
    .expect(await extractInnerText(supportedOperatingSystems.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(supportedOperatingSystems.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(mobileFirstSection.find('[data-test-id="dashboard-section-title"]')))
    .eql('Mobile first approach')
    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-mobile/section/native-mobile-first')
    .expect(await extractInnerText(mobileFirstSection.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(mobileFirstSection.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(memoryAndStorage.find('[data-test-id="dashboard-section-title"]')))
    .eql('Memory and storage')
    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-mobile/section/native-mobile-memory-and-storage')
    .expect(await extractInnerText(memoryAndStorage.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Mandatory')
    .expect(await extractInnerText(memoryAndStorage.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(connectionDetails.find('[data-test-id="dashboard-section-title"]')))
    .eql('Connectivity')
    .expect(connectionDetails.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-mobile/section/native-mobile-connection-details')
    .expect(await extractInnerText(connectionDetails.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(connectionDetails.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(thirdParty.find('[data-test-id="dashboard-section-title"]')))
    .eql('Third-party components and device capabilities')
    .expect(thirdParty.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-mobile/section/native-mobile-third-party')
    .expect(await extractInnerText(thirdParty.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(thirdParty.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(hardwareRequirements.find('[data-test-id="dashboard-section-title"]')))
    .eql('Hardware requirements')
    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-mobile/section/native-mobile-hardware-requirements')
    .expect(await extractInnerText(hardwareRequirements.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(hardwareRequirements.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE')

    .expect(await extractInnerText(additionalInformation.find('[data-test-id="dashboard-section-title"]')))
    .eql('Additional information')
    .expect(additionalInformation.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('native-mobile/section/native-mobile-additional-information')
    .expect(await extractInnerText(additionalInformation.find('[data-test-id="dashboard-section-requirement"]')))
    .eql('Optional')
    .expect(await extractInnerText(additionalInformation.find('[data-test-id="dashboard-section-status"]')))
    .eql('INCOMPLETE');
});

test('should navigate the user to supported operating systems page when clicking on supported operating systems dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-operating-systems`)
    .reply(200, {});

  const supportedOperatingSystemsSection = Selector('[data-test-id="dashboard-section-native-mobile-operating-systems"]');

  await t
    .click(supportedOperatingSystemsSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-mobile/section/native-mobile-operating-systems');
});

test('should navigate the user to the mobile first page when clicking on the mobile first dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-first`)
    .reply(200, {});

  const mobileFirstSection = Selector('[data-test-id="dashboard-section-native-mobile-first"] a');

  await t
    .click(mobileFirstSection)
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-mobile/section/native-mobile-first');
});

test('should navigate the user to memory and storage page when clicking on memory and storage dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-memory-and-storage`)
    .reply(200, {});

  const memoryAndStorageSection = Selector('[data-test-id="dashboard-section-native-mobile-memory-and-storage"]');

  await t
    .click(memoryAndStorageSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-mobile/section/native-mobile-memory-and-storage');
});

test('should navigate the user to the connection details page when clicking on the connection details dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-connection-details`)
    .reply(200, {});

  const connectionDetailsSection = Selector('[data-test-id="dashboard-section-native-mobile-connection-details"]');

  await t
    .click(connectionDetailsSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-mobile/section/native-mobile-connection-details');
});

test('should navigate the user to third-party page when clicking on third-party dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-third-party`)
    .reply(200, {});

  const thirdPartySection = Selector('[data-test-id="dashboard-section-native-mobile-third-party"]');

  await t
    .click(thirdPartySection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-mobile/section/native-mobile-third-party');
});

test('should navigate the user to hardware requirements page when clicking on hardware requirements dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-hardware-requirements`)
    .reply(200, {});

  const hardwareRequirementsSection = Selector('[data-test-id="dashboard-section-native-mobile-hardware-requirements"]');

  await t
    .click(hardwareRequirementsSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-mobile/section/native-mobile-hardware-requirements');
});

test('should navigate the user to additional information page when clicking on additional information dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-additional-information`)
    .reply(200, {});

  const additionalInformationSection = Selector('[data-test-id="dashboard-section-native-mobile-additional-information"]');

  await t
    .click(additionalInformationSection.find('a'))
    .expect(getLocation()).contains('/supplier/solution/S100000-001/dashboard/native-mobile/section/native-mobile-additional-information');
});

test('should render the return to all sections link', async (t) => {
  await pageSetup(t);

  const link = Selector('[data-test-id="sub-dashboard-back-link"] div a');

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
