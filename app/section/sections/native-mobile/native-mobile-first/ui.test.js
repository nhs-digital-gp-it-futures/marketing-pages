import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'native-mobile-first';
const dashboardId = 'native-mobile';

const mobileFirstMarketingData = {
  'mobile-first-design': 'Yes',
};

runTestSuite({
  data: mobileFirstMarketingData,
  sectionId,
  dashboardId,
});
