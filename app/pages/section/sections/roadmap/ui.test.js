import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'roadmap';

const roadmapMarketingData = {
  summary: 'The roadmap summary details',
};

runTestSuite({
  data: roadmapMarketingData,
  sectionId,
});
