import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'features';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/section/${sectionId}`;

const featuresMarketingData = {
  listing: [
    'Feature A',
    'Feature B',
    'Feature C',
  ],
};

const fieldLengthMap = { listing: 100 };

runTestSuite({
  data: featuresMarketingData,
  sectionApiUrl,
  sectionId,
  clientUrl,
  fieldLengthMap,
});
