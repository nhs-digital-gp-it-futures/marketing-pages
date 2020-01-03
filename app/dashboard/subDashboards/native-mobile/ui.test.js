import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';
import nativeMobileFixture from './fixtureData.json';
import { apiLocalhost, apiPath, clientLocalhost } from '../../../test-utils/config';

const mocks = () => {
  nock(apiLocalhost)
    .get(`${apiPath}/dashboards/native-mobile`)
    .reply(200, nativeMobileFixture);
};

const pageSetup = async (t) => {
  mocks();
  await t.navigateTo(`${clientLocalhost}/dashboard/native-mobile`);
};

fixture('Show native mobile dashboard page');
// .afterEach(async (t) => {
// const isDone = nock.isDone();
// if (!isDone) {
//   nock.cleanAll();
// }
// await t.expect(isDone).ok('Not all nock interceptors were used!');
// });

test('should render the native mobile dashboard page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="sub-dashboard-title"]');

  await t
    .expect(title.innerText).eql('Native mobile or tablet');
});

test('should render the native mobile dashboard main advice', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="sub-dashboard-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add further detail about your native mobile or tablet application.');
});

test('should render native mobile section group', async (t) => {
  await pageSetup(t);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-native-mobile-sections"]');

  await t
    .expect(browserBasedSectionGroup.find('h2').innerText).eql('Native mobile or tablet sections');
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
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Supported operating systems')
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-mobile/section/native-mobile-operating-systems')
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(supportedOperatingSystems.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Mobile first')
    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-mobile/section/native-mobile-first')
    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Memory and storage')
    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-mobile/section/native-mobile-memory-and-storage')
    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(memoryAndStorage.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(connectionDetails.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Connection details')
    .expect(connectionDetails.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-mobile/section/native-mobile-connection-details')
    .expect(connectionDetails.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(connectionDetails.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(thirdParty.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Third party components and device capabilities')
    .expect(thirdParty.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-mobile/section/native-mobile-third-party')
    .expect(thirdParty.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(thirdParty.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Hardware requirements')
    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-mobile/section/native-mobile-hardware-requirements')
    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(hardwareRequirements.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(additionalInformation.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Additional information')
    .expect(additionalInformation.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/dashboard/native-mobile/section/native-mobile-additional-information')
    .expect(additionalInformation.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(additionalInformation.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE');
});

test('should navigate the user to supported operating systems page when clicking on supported operating systems dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-operating-systems`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const supportedOperatingSystemsSection = Selector('[data-test-id="dashboard-section-native-mobile-operating-systems"]');

  await t
    .click(supportedOperatingSystemsSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-mobile/section/native-mobile-operating-systems');
});

test('should navigate the user to the mobile first page when clicking on the mobile first dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-first`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const mobileFirstSection = Selector('[data-test-id="dashboard-section-native-mobile-first"] a');

  await t
    .click(mobileFirstSection)
    .expect(getLocation()).contains('S100000-001/dashboard/native-mobile/section/native-mobile-first');
});

test('should navigate the user to memory and storage page when clicking on memory and storage dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-memory-and-storage`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const memoryAndStorageSection = Selector('[data-test-id="dashboard-section-native-mobile-memory-and-storage"]');

  await t
    .click(memoryAndStorageSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-mobile/section/native-mobile-memory-and-storage');
});

test('should navigate the user to the connection details page when clicking on the connection details dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-connection-details`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const connectionDetailsSection = Selector('[data-test-id="dashboard-section-native-mobile-connection-details"]');

  await t
    .click(connectionDetailsSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-mobile/section/native-mobile-connection-details');
});

test('should navigate the user to third party page when clicking on third party dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-third-party`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const thirdPartySection = Selector('[data-test-id="dashboard-section-native-mobile-third-party"]');

  await t
    .click(thirdPartySection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-mobile/section/native-mobile-third-party');
});

test('should navigate the user to hardware requirements page when clicking on hardware requirements dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-hardware-requirements`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const hardwareRequirementsSection = Selector('[data-test-id="dashboard-section-native-mobile-hardware-requirements"]');

  await t
    .click(hardwareRequirementsSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-mobile/section/native-mobile-hardware-requirements');
});

test('should navigate the user to additional information page when clicking on additional information dashboard row', async (t) => {
  await pageSetup(t);

  nock(apiLocalhost)
    .get(`${apiPath}/sections/native-mobile-additional-information`)
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const additionalInformationSection = Selector('[data-test-id="dashboard-section-native-mobile-additional-information"]');

  await t
    .click(additionalInformationSection.find('a'))
    .expect(getLocation()).contains('S100000-001/dashboard/native-mobile/section/native-mobile-additional-information');
});

test('should render the return to all sections link', async (t) => {
  await pageSetup(t);

  const link = Selector('[data-test-id="sub-dashboard-back-link"] div a');

  await t
    .expect(link.exists).ok()
    .expect(link.innerText).eql('Return to all sections');
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
