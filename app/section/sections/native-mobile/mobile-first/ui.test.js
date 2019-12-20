import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'mobile-first';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/native-mobile/section/${sectionId}`;
const parentSectionApiUrl = '/api/v1/Solutions/S100000-001/sections/native-mobile';

const mobileFirstMarketingData = {
  'mobile-first-design': 'Yes',
};

runTestSuite({
  data: mobileFirstMarketingData,
  sectionApiUrl,
  sectionId,
  clientUrl,
  parentSectionApiUrl,
});
