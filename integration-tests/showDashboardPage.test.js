import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import aSolutionFixture from './fixtures/aSolution.json';
import aSolutionWithMarketingDataFixture from './fixtures/aSolutionWithMarketingData.json';
import { ManifestProvider } from '../app/forms/manifestProvider';


const mocks = (isFirstLoad) => {
  if (isFirstLoad) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001')
      .reply(200, aSolutionFixture);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001')
      .reply(200, aSolutionWithMarketingDataFixture);
  }

  nock('http://localhost:8080')
    .put('/api/v1/Solutions/S100000-001')
    .reply(200, {});
};

const pageSetup = async (t, isFirstLoad = true) => {
  mocks(isFirstLoad);
  await t.navigateTo('http://localhost:1234/S100000-001');
};

fixture('Show marketing dashboard page');

test('should render the marketing dashboard page title', async (t) => {
  pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(title.innerText).eql('Marketing Page - Dashboard');
});

test('should render the sectionGroups configured in the dashboard manifest', async (t) => {
  pageSetup(t);

  const dashboardManifest = new ManifestProvider().getDashboardManifest();
  const dashboardSectionGroups = dashboardManifest.sectionGroups;

  await Promise.all(dashboardSectionGroups.map(async (dashboardSectionGroup, idx) => {
    const theSectionGroup = Selector(`[data-test-id="dashboard-sectionGroup-${idx + 1}"]`);
    await t
      .expect(theSectionGroup.count).eql(1)
      .expect(theSectionGroup.find('h2').innerText).eql(dashboardSectionGroup.title);
  }));
});

test('should render all the sections for sectionGroups', async (t) => {
  pageSetup(t);

  const dashboardManifest = new ManifestProvider().getDashboardManifest();
  const dashboardsectionGroups = dashboardManifest.sectionGroups;

  await Promise.all(dashboardsectionGroups.map(async (dashboardSectionGroup, idx) => {
    const theSectionGroup = Selector(`[data-test-id="dashboard-sectionGroup-${idx + 1}"]`);

    await Promise.all(dashboardSectionGroup.sections.map(async (section, sectionIdx) => {
      const theSection = theSectionGroup.find(`[data-test-id="dashboard-section-${sectionIdx + 1}"]`);
      await t
        .expect(theSection.count).eql(1)
        .expect(theSection.find('[data-test-id="dashboard-section-title"]').innerText)
        .eql(section.title)
        .expect(theSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
        .eql(section.requirement)
        .expect(theSection.find('[data-test-id="dashboard-section-status"]').innerText)
        .eql('INCOMPLETE');
    }));
  }));
});

test('should render the correct status for a solution with marketing data and status', async (t) => {
  pageSetup(t, false);

  const dashboardManifest = new ManifestProvider().getDashboardManifest();
  const dashboardsectionGroups = dashboardManifest.sectionGroups;

  await Promise.all(dashboardsectionGroups.map(async (dashboardSectionGroup, idx) => {
    const theSectionGroup = Selector(`[data-test-id="dashboard-sectionGroup-${idx + 1}"]`);

    await Promise.all(dashboardSectionGroup.sections.map(async (section, sectionIdx) => {
      const theSection = theSectionGroup.find(`[data-test-id="dashboard-section-${sectionIdx + 1}"]`);

      await t
        .expect(theSection.count).eql(1)
        .expect(theSection.find('[data-test-id="dashboard-section-title"]').innerText)
        .eql(section.title)
        .expect(theSection.find('[data-test-id="dashboard-section-requirement"]').innerText)
        .eql(section.requirement)
        .expect(theSection.find('[data-test-id="dashboard-section-status"]').innerText)
        .eql('COMPLETE');
    }));
  }));
});

test('clicking on the section link should navigate the user to the section page', async (t) => {
  pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001')
    .reply(200, aSolutionFixture);

  const getLocation = ClientFunction(() => document.location.href);

  const dashboardManifest = new ManifestProvider().getDashboardManifest();
  const dashboardsectionGroups = dashboardManifest.sectionGroups;

  await Promise.all(dashboardsectionGroups.map(async (dashboardSectionGroup, idx) => {
    const theSectionGroup = Selector(`[data-test-id="dashboard-sectionGroup-${idx + 1}"]`);

    await Promise.all(dashboardSectionGroup.sections.map(async (section, sectionIdx) => {
      const theSection = theSectionGroup.find(`[data-test-id="dashboard-section-${sectionIdx + 1}"]`);

      await t
        .click(theSection.find('a'))
        .expect(getLocation()).contains(`S100000-001/section/${section.id}`);
    }));
  }));
});
