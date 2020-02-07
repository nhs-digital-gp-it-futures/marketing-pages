import { runTestSuite } from '../../../../../test-utils/runTestSuite';

const sectionId = 'epics';

const epicsMarketingData = {
  epics: '',
};

runTestSuite({
  data: epicsMarketingData,
  sectionId,
  userContextType: 'authority',
});
