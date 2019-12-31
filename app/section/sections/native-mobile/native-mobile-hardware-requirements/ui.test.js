import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'native-mobile-hardware-requirements';
const dashboardId = 'native-mobile';

const hardwareRequirementsData = {
  'hardware-requirements': 'To fully utilise our print functionality within the application, you will need a WiFi or Bluetooth connected printer to connect and print documents straight from the device.',
};

runTestSuite({
  data: hardwareRequirementsData,
  sectionId,
  dashboardId,
});
