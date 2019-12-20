import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'browser-hardware-requirements';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/${sectionId}`;
const parentSectionApiUrl = '/api/v1/Solutions/S100000-001/sections/browser-based';

const browserHardwareRequirementMarketingData = {
  'hardware-requirements-description': 'Some hardware requirement detail',
};

runTestSuite({
  data: browserHardwareRequirementMarketingData,
  sectionApiUrl,
  sectionId,
  clientUrl,
  parentSectionApiUrl,
});
