import { runTestSuite } from '../../../../../../test-utils/runTestSuite';

const sectionId = 'native-desktop-hardware-requirements';
const dashboardId = 'native-desktop';

const hardwareRequirementsData = {
  'hardware-requirements': 'To fully utilise the transcribing functionality within the application, you will need to purchase our branded wireless Dictaphone.',
};

runTestSuite({
  data: hardwareRequirementsData,
  sectionId,
  dashboardId,
});
