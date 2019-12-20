import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'mobile-operating-systems';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/native-mobile/section/${sectionId}`;
const parentSectionApiUrl = '/api/v1/Solutions/S100000-001/sections/native-mobile';

const mobileOperatingSystemsMarketingData = {
  'operating-systems': ['apple-ios', 'android', 'other'],
  'operating-systems-description': 'Text for description',
};

runTestSuite({
  data: mobileOperatingSystemsMarketingData,
  sectionApiUrl,
  sectionId,
  clientUrl,
  parentSectionApiUrl,
});
