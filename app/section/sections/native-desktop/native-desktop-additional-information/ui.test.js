import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'native-desktop-additional-information';
const dashboardId = 'native-desktop';

const additionalInformationData = {
  'additional-information': 'It is possible that it may install on other platforms or versions not listed in this section. However, support is limited to systems that meet the minimum requirements.',
};

runTestSuite({
  data: additionalInformationData,
  sectionId,
  dashboardId,
});
