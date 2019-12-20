import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'features';
const clientUrl = `http://localhost:1234/solution/S100000-001/section/${sectionId}`;

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
  clientUrl,
});
