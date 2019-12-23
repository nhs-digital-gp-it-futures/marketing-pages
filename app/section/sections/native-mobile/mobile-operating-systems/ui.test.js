import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'mobile-operating-systems';
const dashboardId = 'native-mobile';

const mobileOperatingSystemsMarketingData = {
  'operating-systems': ['Apple IOS', 'Android'],
  'operating-systems-description': 'Text for description',
};

runTestSuite({
  data: mobileOperatingSystemsMarketingData,
  sectionId,
  dashboardId,
});
