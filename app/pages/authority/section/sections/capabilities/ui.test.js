import { runTestSuite } from '../../../../../test-utils/runTestSuite';

const sectionId = 'capabilities';

const capabilitiesMarketingData = {
  capabilities: '',
};

runTestSuite({
  data: capabilitiesMarketingData,
  sectionId,
  userContextType: 'authority',
});
