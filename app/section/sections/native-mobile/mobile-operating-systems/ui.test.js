import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'mobile-operating-systems';
const dashboardId = 'native-mobile';

const mobileOperatingSystemsMarketingData = {
  'operating-systems': ['apple-ios', 'android', 'other'],
  'operating-systems-description': 'Text for description',
};

runTestSuite({
  data: mobileOperatingSystemsMarketingData,
  sectionId,
  dashboardId,
});
