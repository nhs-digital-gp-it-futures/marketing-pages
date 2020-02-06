import { createTestHarness } from '../../../test-utils/testHarness';

const setup = {
  template: {
    path: 'pages/authority/dashboard/template.njk',
  },
};

describe('authority - dashboard page', () => {
  it('should render the title of the authority dashboard page', createTestHarness(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      expect($('h1').text().trim()).toEqual('Marketing Page - Authority - Dashboard');
    });
  }));

  it('should render the sectionGroups on the dashboard page', createTestHarness(setup, (harness) => {
    const context = {
      sectionGroups: [
        {
          title: 'Some section group title',
          sections: [],
        },
      ],
    };

    harness.request(context, ($) => {
      expect($('[data-test-id^="dashboard-sectionGroup"]').length).toEqual(1);
    });
  }));
});
