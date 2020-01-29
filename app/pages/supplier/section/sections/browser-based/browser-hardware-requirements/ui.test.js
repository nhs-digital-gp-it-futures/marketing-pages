import { runTestSuite } from '../../../../../../test-utils/runTestSuite';

const sectionId = 'browser-hardware-requirements';
const dashboardId = 'browser-based';

const browserHardwareRequirementMarketingData = {
  'hardware-requirements-description': 'Some hardware requirement detail',
};

runTestSuite({
  data: browserHardwareRequirementMarketingData,
  sectionId,
  dashboardId,
});
