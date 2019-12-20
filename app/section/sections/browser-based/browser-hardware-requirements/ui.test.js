import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'browser-hardware-requirements';
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/${sectionId}`;
const dashboardId = 'browser-based';

const browserHardwareRequirementMarketingData = {
  'hardware-requirements-description': 'Some hardware requirement detail',
};

runTestSuite({
  data: browserHardwareRequirementMarketingData,
  sectionId,
  clientUrl,
  dashboardId,
});
