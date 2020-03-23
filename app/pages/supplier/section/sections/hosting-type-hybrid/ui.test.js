import { runTestSuite } from '../../../../../test-utils/runTestSuite';

const sectionId = 'hosting-type-hybrid';

const hostingTypeHybridMarketingData = {
  summary: 'Our solution uses a combination of private and public cloud suppliers. We store all of our patient confidential data in a data center that we own and manage. We leverage the power of [Public cloud provider] to run our analytical suite and only transfer anonymised or pseudonymised to that provider to support this.',
  link: 'www.healthcare-pro.co.uk/healthcare-system-1/hybrid-hosting',
  'hosting-model': 'Our managed data center is hosted in two separate geographical locations, they both comply to the highest standards to ensure that even if one of our data centers suffers an outage, we can ensure that your daily activities are not interrupted. We also create a back up of all of our data every evening and store it separately, so in the result of any catastrophic failure, we can ensure that patient confidential information is kept secure.',
  'requires-hscn': [
    'End user devices must be connected to HSCN/N3',
  ],
};

runTestSuite({
  data: hostingTypeHybridMarketingData,
  sectionId,
});
