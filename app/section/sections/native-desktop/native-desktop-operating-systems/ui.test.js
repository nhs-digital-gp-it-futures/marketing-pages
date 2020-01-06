import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'native-desktop-operating-systems';
const dashboardId = 'native-desktop';

const desktopOperatingSystemsMarketingData = {
  'operating-systems-description': 'Windows 7 and above.',
};

runTestSuite({
  data: desktopOperatingSystemsMarketingData,
  sectionId,
  dashboardId,
});
