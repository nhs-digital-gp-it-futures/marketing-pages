import { runTestSuite } from '../../../../../test-utils/runTestSuite';

const sectionId = 'capabilities';

const capabilitiesMarketingData = {
  capabilities: 'capability stuff',
};

runTestSuite({
  data: capabilitiesMarketingData,
  sectionId,
  userContextType: 'authority',
});
