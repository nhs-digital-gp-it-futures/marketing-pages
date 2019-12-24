import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'browser-plug-ins-or-extensions';
const dashboardId = 'browser-based';

const pluginsOrExtensionsMarketingData = {
  'plugins-required': 'No',
  'plugins-detail': 'Some plugin and extension detail',
};

runTestSuite({
  data: pluginsOrExtensionsMarketingData,
  sectionId,
  dashboardId,
});
