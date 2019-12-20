import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'plug-ins-or-extensions';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/${sectionId}`;
const dashboardId = 'browser-based';

const pluginsOrExtensionsMarketingData = {
  'plugins-required': 'No',
  'plugins-detail': 'Some plugin and extension detail',
};

runTestSuite({
  data: pluginsOrExtensionsMarketingData,
  sectionId,
  clientUrl,
  dashboardId,
});
