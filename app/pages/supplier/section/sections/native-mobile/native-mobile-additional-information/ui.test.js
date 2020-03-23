import { runTestSuite } from '../../../../../../test-utils/runTestSuite';

const sectionId = 'native-mobile-additional-information';
const dashboardId = 'native-mobile';

const additionalInformationData = {
  'additional-information': 'It is possible that it may install on other platforms or versions not listed in this section. However, support is limited to systems that meet the minimum requirements.',
};

runTestSuite({
  data: additionalInformationData,
  sectionId,
  dashboardId,
});
