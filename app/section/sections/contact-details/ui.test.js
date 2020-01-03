import { runTestSuite } from '../../../test-utils/runTestSuite';

const sectionId = 'contact-details';

const contactDetailsMarketingData = {
  'contact-1': {
    'first-name': 'Peter',
    'last-name': 'Parker',
    'phone-number': '01234 567890',
    'email-address': 'peter.parker@avengers.com',
    'department-name': 'Web Developer',
  },
  'contact-2': {
    'first-name': 'Bruce',
    'last-name': 'Banner',
    'phone-number': '04321 098765',
    'email-address': 'bruce.banner@avengers.com',
    'department-name': 'Eco Warrior',
  },
};

const errorPostBodyData = {
  'contact-1': {
    'first-name': '',
    'last-name': '',
    'phone-number': '',
    'email-address': '',
    'department-name': '',
  },
  'contact-2': {
    'first-name': '',
    'last-name': '',
    'phone-number': '',
    'email-address': '',
    'department-name': '',
  },
};

runTestSuite({
  data: contactDetailsMarketingData,
  sectionId,
  errorPostBodyData,
});
