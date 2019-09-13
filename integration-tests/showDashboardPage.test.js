import nock from 'nock';
import { Selector } from 'testcafe';
import aSolutionFixture from './fixtures/aSolution.json';
import { ManifestProvider } from '../app/forms/manifestProvider';


const mocks = () => {
  nock('http://localhost:5000')
    .get('/api/v1/solution/S100000-001')
    .reply(200, aSolutionFixture);

  nock('http://localhost:5000')
    .post('/api/v1/solution/S100000-001')
    .reply(200, {});
};

const pageSetup = async (t) => {
  mocks();
  await t.navigateTo('http://localhost:1234/');
};

fixture('Show marketing dashboard page');

test('should render the marketing dashboard page title', async (t) => {
  pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(title.innerText).eql('Marketing Page - Dashboard');
});

test('should render the sections configured in the dashboard manifest', async (t) => {
  pageSetup(t);

  const dashboardManifest = new ManifestProvider().getDashboardManifest();
  const dashboardSections = dashboardManifest.sections;

  await Promise.all(dashboardSections.map(async (dashboardSection, idx) => {
    const theSection = Selector(`[data-test-id="dashboard-section-${idx + 1}"]`);
    await t
      .expect(theSection.count).eql(1)
      .expect(theSection.find('h2').innerText).eql(dashboardSection.title);
  }));
});

test('should render all the tasks for sections', async (t) => {
  pageSetup(t);

  const dashboardManifest = new ManifestProvider().getDashboardManifest();
  const dashboardSections = dashboardManifest.sections;

  await Promise.all(dashboardSections.map(async (dashboardSection, idx) => {
    const theSection = Selector(`[data-test-id="dashboard-section-${idx + 1}"]`);

    await Promise.all(dashboardSection.tasks.map(async (task, taskIdx) => {
      const theTask = theSection.find(`[data-test-id="dashboard-section-task-${taskIdx + 1}"]`);
      await t
        .expect(theTask.count).eql(1)
        .expect(theTask.find('[data-test-id="dashboard-section-task-title"]').innerText)
        .eql(task.title)
        .expect(theTask.find('[data-test-id="dashboard-section-task-requirement"]').innerText)
        .eql(task.requirement)
        .expect(theTask.find('[data-test-id="dashboard-section-task-status"]').innerText)
        .eql('INCOMPLETE');
    }));
  }));
});
