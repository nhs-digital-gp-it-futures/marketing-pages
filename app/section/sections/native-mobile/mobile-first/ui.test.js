import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'mobile-first';
const dashboardId = 'native-mobile';

const mobileFirstMarketingData = {
  'mobile-first-design': 'Yes',
};

runTestSuite({
  data: mobileFirstMarketingData,
  sectionId,
  dashboardId,
});
