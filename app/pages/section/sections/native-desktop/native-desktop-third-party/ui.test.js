import { runTestSuite } from '../../../../../test-utils/runTestSuite';

const sectionId = 'native-desktop-third-party';
const dashboardId = 'native-desktop';

const thirdPartyData = {
  'third-party-components': 'To fully utilise the letter template functionality, you will need a fully licensed version of Microsoft Word 2013 or higher.',
  'device-capabilities': 'In order to use our branded wireless Dictaphone, the device will require Bluetooth.',
};

runTestSuite({
  data: thirdPartyData,
  sectionId,
  dashboardId,
});
