import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'features';

const featuresMarketingData = {
  listing: [
    'Feature A',
    'Feature B',
    'Feature C',
  ],
};

runTestSuite({
  data: featuresMarketingData,
  sectionId,
});
