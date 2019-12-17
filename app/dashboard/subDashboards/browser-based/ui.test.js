import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';
import aBrowserBasedFixture from '../../../../fixtures/aBrowserBasedData.json';

const mocks = () => {
  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/browser-based')
    .reply(200, aBrowserBasedFixture);
};

const pageSetup = async (t) => {
  mocks();
  await t.navigateTo('http://localhost:1234/solution/S100000-001/dashboard/browser-based');
};

fixture('Show browser based dashboard page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the browser based dashboard page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="sub-dashboard-title"]');

  await t
    .expect(title.innerText).eql('Browser based');
});

test('should render the browser based dashboard main advice', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="sub-dashboard-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add further detail about your browser based application.');
});

test('should render the Browser based section group', async (t) => {
  await pageSetup(t);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');

  await t
    .expect(browserBasedSectionGroup.find('h2').innerText).eql('Browser based sections');
});

test('should render all the sections for the Browser based sections section group', async (t) => {
  await pageSetup(t);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const browsersSupportedSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browsers-supported"]');
  const mobileFirstSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-mobile-first"]');
  const pluginsOrExtensionsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-plug-ins-or-extensions"]');
  const connectivityAndResolutionSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-connectivity-and-resolution"]');
  const hardwareRequirementsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-hardware-requirements"]');
  const additionalInformationSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-additional-information"]');

  await t
    .expect(browsersSupportedSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Browsers supported')
    .expect(browsersSupportedSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/section/browsers-supported')
    .expect(browsersSupportedSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(browsersSupportedSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Mobile first')
    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/section/browser-mobile-first')
    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(mobileFirstSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Plug-ins or extensions')
    .expect(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/section/plug-ins-or-extensions')
    .expect(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Connectivity and resolution')
    .expect(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/section/connectivity-and-resolution')
    .expect(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(hardwareRequirementsSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Hardware requirements')
    .expect(hardwareRequirementsSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/section/browser-hardware-requirements')
    .expect(hardwareRequirementsSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(hardwareRequirementsSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(additionalInformationSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Additional information')
    .expect(additionalInformationSection.find('[data-test-id="dashboard-section-title"] a').getAttribute('href'))
    .eql('/solution/S100000-001/section/browser-additional-information')
    .expect(additionalInformationSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(additionalInformationSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE');
});

test('should navigate the user to the browsers supported page when clicking on the browsers supported dashboard row', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/browsers-supported')
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const browsersSupportedSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browsers-supported"]');

  await t
    .click(browsersSupportedSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/browsers-supported');
});

test('should navigate the user to the mobile first page when clicking on the mobile first dashboard row', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/browser-mobile-first')
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const mobileFirstSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-mobile-first"]');

  await t
    .click(mobileFirstSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/browser-mobile-first');
});

test('should navigate the user to the plug-ins or extensions page when clicking on the plug-ins or extensions dashboard row', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/plug-ins-or-extensions')
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const pluginsOrExtensionsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-plug-ins-or-extensions"]');

  await t
    .click(pluginsOrExtensionsSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/plug-ins-or-extensions');
});

test('should navigate the user to the connectivity and resolution page when clicking on the connectivity and resolution dashboard row', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/connectivity-and-resolution')
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const connectivityAndResolutionSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-connectivity-and-resolution"]');

  await t
    .click(connectivityAndResolutionSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/connectivity-and-resolution');
});

test('should navigate the user to the hardware requirements page when clicking on the hardware requirements dashboard row', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/browser-hardware-requirements')
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const hardwareRequirementsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-hardware-requirements"]');

  await t
    .click(hardwareRequirementsSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/browser-hardware-requirements');
});

test('should navigate the user to the additional information page when clicking on the additional information dashboard row', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/browser-additional-information')
    .reply(200, {});

  const getLocation = ClientFunction(() => document.location.href);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const additionalInformationSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browser-additional-information"]');

  await t
    .click(additionalInformationSection.find('a'))
    .expect(getLocation()).contains('/solution/S100000-001/section/browser-additional-information');
});

test('should render the return to all sections link', async (t) => {
  await pageSetup(t);

  const link = Selector('[data-test-id="sub-dashboard-back-link"] a');

  await t
    .expect(link.innerText).eql('Return to all sections');
});

test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/dashboard')
    .reply(200, dashboardWithCompleteSections);

  const getLocation = ClientFunction(() => document.location.href);

  const link = Selector('[data-test-id="sub-dashboard-back-link"] a');

  await t
    .click(link)
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('/solution/S100000-001');
});
