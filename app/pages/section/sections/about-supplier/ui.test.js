import { runTestSuite } from '../../../../test-utils/runTestSuite';

const sectionId = 'about-supplier';

const aboutSupplierMarketingData = {
  description: 'The supplier description data',
  link: 'www.somelink.com',
};

runTestSuite({
  data: aboutSupplierMarketingData,
  sectionId,
});
