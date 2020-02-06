import { createTestHarness } from '../../../../test-utils/testHarness';

const setup = {
  template: {
    path: 'pages/supplier/dashboard/subDashboards/template.njk',
  },
};

describe('sub dashboard page', () => {
  it('should render the title of the sub dashboard', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the sub dashboard',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="sub-dashboard-title"]').text().trim()).toEqual('Title of the sub dashboard');
    });
  }));

  it('should render the main advice of the sub dashboard', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the sub dashboard',
      mainAdvice: 'This is the main advice for this sub dashboard',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="sub-dashboard-main-advice"]').text().trim()).toEqual('This is the main advice for this sub dashboard');
    });
  }));

  it('should render any additional advice of the sub dashboard', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the sub dashboard',
      additionalAdvice: [
        'First bit of addtional advice',
        'Second bit of addtional advice',
      ],
    };

    harness.request(context, ($) => {
      context.additionalAdvice.map((advice, idx) => {
        expect($(`[data-test-id="sub-dashboard-additional-advice"] p:nth-child(${idx + 1})`).text().trim()).toEqual(advice);
      });
    });
  }));

  it('should render the sectionGroups on the sub dashboard page', createTestHarness(setup, (harness) => {
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

  it('should render the return to all sections link', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="sub-dashboard-back-link"] a').length).toEqual(1);
      expect($('[data-test-id="sub-dashboard-back-link"] a').text().trim()).toEqual('Return to all sections');
    });
  }));
});
