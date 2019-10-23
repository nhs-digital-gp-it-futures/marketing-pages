import nock from 'nock';
import { Selector } from 'testcafe';

const browserBasedMarketingData = {
  sections: [
    {
      id: 'browsers-supported',
      status: 'INCOMPLETE',
      requirement: 'Mandatory',
    },
    {
      id: 'plug-ins-or-extensions',
      status: 'INCOMPLETE',
      requirement: 'Mandatory',
    },
    {
      id: 'connectivity-and-resolution',
      status: 'INCOMPLETE',
      requirement: 'Mandatory',
    },
    {
      id: 'hardware-requirements',
      status: 'INCOMPLETE',
      requirement: 'Optional',
    },
    {
      id: 'additional-information',
      status: 'INCOMPLETE',
      requirement: 'Optional',
    },
  ],
};

const mocks = () => {
  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/sections/browser-based')
    .reply(200, browserBasedMarketingData);
};

const pageSetup = async (t) => {
  mocks();
  await t.navigateTo('http://localhost:1234/S100000-001/dashboard/browser-based');
};

fixture('Show browser based dashboard page');

test('should render the browser based dashboard page title', async (t) => {
  pageSetup(t);

  const title = Selector('[data-test-id="sub-dashboard-title"]');

  await t
    .expect(title.innerText).eql('Browser based');
});

test('should render the browser based dashboard main advice', async (t) => {
  pageSetup(t);

  const mainAdvice = Selector('[data-test-id="sub-dashboard-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add further detail about your browser based application.');
});

test('should render the Browser based section group', async (t) => {
  pageSetup(t);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');

  await t
    .expect(browserBasedSectionGroup.find('h2').innerText).eql('Browser based sections');
});

test('should render all the sections for the Browser based sections section group', async (t) => {
  pageSetup(t);

  const browserBasedSectionGroup = Selector('[data-test-id="dashboard-sectionGroup-browser-based-sections"]');
  const browsersSupportedSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-browsers-supported"]');
  const pluginsOrExtensionsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-plug-ins-or-extensions"]');
  const connectivityAndResolutionSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-connectivity-and-resolution"]');
  const hardwareRequirementsSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-hardware-requirements"]');
  const additionalInformationSection = browserBasedSectionGroup.find('[data-test-id="dashboard-section-additional-information"]');

  await t
    .expect(browsersSupportedSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Browsers supported')
    .expect(browsersSupportedSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(browsersSupportedSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Plug-ins or extensions')
    .expect(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(pluginsOrExtensionsSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Connectivity and resolution')
    .expect(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Mandatory')
    .expect(connectivityAndResolutionSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(hardwareRequirementsSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Hardware requirements')
    .expect(hardwareRequirementsSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(hardwareRequirementsSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE')

    .expect(additionalInformationSection.find('[data-test-id="dashboard-section-title"]').innerText)
    .eql('Additional information')
    .expect(additionalInformationSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
    .eql('Optional')
    .expect(additionalInformationSection.find('[data-test-id="dashboard-section-status"]').innerText)
    .eql('INCOMPLETE');
});
