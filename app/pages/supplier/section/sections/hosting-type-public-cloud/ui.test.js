import { runTestSuite } from '../../../../../test-utils/runTestSuite';

const sectionId = 'hosting-type-public-cloud';

const hostingTypePublicCloudMarketingData = {
  summary: 'Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.',
  link: 'www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting',
  'requires-hscn': [
    'End user devices must be connected to HSCN/N3',
  ],
};

runTestSuite({
  data: hostingTypePublicCloudMarketingData,
  sectionId,
});
