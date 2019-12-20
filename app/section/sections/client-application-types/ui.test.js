import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'client-application-types';

const mobileFirstMarketingData = {
  'client-application-types': ['native-mobile'],
};

runTestSuite({
  data: mobileFirstMarketingData,
  sectionId,
});
