import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'plug-ins-or-extensions';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/${sectionId}`;
const parentSectionApiUrl = '/api/v1/Solutions/S100000-001/sections/browser-based';

const pluginsOrExtensionsMarketingData = {
  'plugins-required': 'No',
  'plugins-detail': 'Some plugin and extension detail',
};

runTestSuite({
  data: pluginsOrExtensionsMarketingData,
  sectionApiUrl,
  sectionId,
  clientUrl,
  parentSectionApiUrl,
});
