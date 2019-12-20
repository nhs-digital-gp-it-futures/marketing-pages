import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'browsers-supported';
const sectionApiUrl = `/api/v1/Solutions/S100000-001/sections/${sectionId}`;
const clientUrl = `http://localhost:1234/solution/S100000-001/dashboard/browser-based/section/${sectionId}`;
const parentSectionApiUrl = '/api/v1/Solutions/S100000-001/sections/browser-based';

const browserSupportedMarketingData = {
  'supported-browsers': [
    'Google Chrome',
    'Internet Explorer 10',
  ],
  'mobile-responsive': 'Yes',
};

runTestSuite({
  data: browserSupportedMarketingData,
  sectionApiUrl,
  sectionId,
  clientUrl,
  parentSectionApiUrl,
});
