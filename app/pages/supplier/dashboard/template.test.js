import { componentTester } from '../../../test-utils/componentTester';

const setup = {
  template: {
    path: 'pages/supplier/dashboard/template.njk',
  },
};

describe('supplier - dashboard page', () => {
  it('should render the title on the dashboard page if provided', componentTester(setup, (harness) => {
    const context = {
      title: 'some title',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-title"]').text().trim()).toEqual('some title');
    });
  }));

  it('should not render the title on the dashboard page if not provided', componentTester(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-title"]').length).toEqual(0);
    });
  }));

  it('should render the supplier name tag on the dashboard page if provided', componentTester(setup, (harness) => {
    const context = {
      supplierName: 'some supplier',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="supplier-name-tag"]').text().trim()).toEqual('some supplier');
    });
  }));

  it('should not render the supplier name tag on the dashboard page if not provided', componentTester(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      expect($('[data-test-id="supplier-name-tag"]').length).toEqual(0);
    });
  }));

  it('should render the main advice on the dashboard page if provided', componentTester(setup, (harness) => {
    const context = {
      mainAdvice: 'some main advice',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-main-advice"]').text().trim()).toEqual('some main advice');
    });
  }));

  it('should not render the main advice on the dashboard page if not provided', componentTester(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-main-advice"]').length).toEqual(0);
    });
  }));

  it('should render the additional advice on the dashboard page if provided', componentTester(setup, (harness) => {
    const context = {
      additionalAdvice: 'some additional advice',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-additional-advice"] .nhsuk-u-visually-hidden').text().trim()).toEqual('Information:');
      expect($('[data-test-id="dashboard-additional-advice"] p').text().trim()).toEqual('some additional advice');
    });
  }));

  it('should not render the additional advice on the dashboard page if not provided', componentTester(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-additional-advice"]').length).toEqual(0);
    });
  }));

  it('should render the warning advice on the dashboard page if provided and showSubmitForModerationButton is true', componentTester(setup, (harness) => {
    const context = {
      warningAdvice: 'some warning advice',
      config: { showSubmitForModerationButton: 'true' },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-warning-advice"]').length).toEqual(1);
      expect($('[data-test-id="dashboard-warning-advice"] .nhsuk-u-visually-hidden').text().trim()).toEqual('Information:');
      expect($('[data-test-id="dashboard-warning-advice"] p').text().trim()).toEqual('some warning advice');
    });
  }));

  it('should notrender the warning advice on the dashboard page if provided and showSubmitForModerationButton is false', componentTester(setup, (harness) => {
    const context = {
      warningAdvice: 'some warning advice',
      config: { showSubmitForModerationButton: 'false' },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-warning-advice"]').length).toEqual(0);
    });
  }));

  it('should not render the warning advice on the dashboard page if not provided', componentTester(setup, (harness) => {
    const context = { config: { showSubmitForModerationButton: 'true' } };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-warning-advice"]').length).toEqual(0);
    });
  }));

  it('should render the sections box on the dashboard page if provided', componentTester(setup, (harness) => {
    const context = {
      sectionsBox: {
        title: 'some title',
        mainAdvice: 'some main advice',
        sections: [
          'some section 1',
          'some section 2',
          'some section 3',
        ],
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-sections-box"]').length).toEqual(1);
      expect($('[data-test-id="dashboard-sections-box"] h3').text().trim()).toEqual('some title');
      expect($('[data-test-id="dashboard-sections-box"] p').text().trim()).toEqual('some main advice');
      expect($('[data-test-id="dashboard-sections-box"] ul').length).toEqual(1);
      expect($('[data-test-id="dashboard-sections-box"] li').length).toEqual(3);
    });
  }));

  it('should not render the sections box on the dashboard page if not provided', componentTester(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-sections-box"]').length).toEqual(0);
    });
  }));

  it('should render the error summary if errors', componentTester(setup, (harness) => {
    const context = {
      title: 'Title of the section',
      errors: [{}],
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="error-summary"]').length).toEqual(1);
    });
  }));

  it('should render the preview button at the top of the page', componentTester(setup, (harness) => {
    const context = {
      previewUrl: '/solution/S100000-001/preview',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-preview-button"] a').length).toEqual(1);
      expect($('[data-test-id="dashboard-preview-button"] a').text().trim()).toEqual('Preview your page');
      expect($('[data-test-id="dashboard-preview-button"] a').attr('href')).toEqual('/solution/S100000-001/preview');
    });
  }));

  it('should render the sectionGroups on the dashboard page', componentTester(setup, (harness) => {
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

  it('should render the Submit for moderation button at the bottom of the page if showSubmitForModerationButton is true', componentTester(setup, (harness) => {
    const context = {
      submitForModerationUrl: '/supplier/solution/S100000-001/submitForModeration',
      config: {
        showSubmitForModerationButton: 'true',
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').length).toEqual(1);
      expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').text().trim()).toEqual('Submit for moderation');
      expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').attr('href')).toEqual('/supplier/solution/S100000-001/submitForModeration');
    });
  }));

  it('should not render the Submit for moderation button at the bottom of the page if showSubmitForModerationButton is false', componentTester(setup, (harness) => {
    const context = {
      submitForModerationUrl: '/supplier/solution/S100000-001/submitForModeration',
      config: {
        showSubmitForModerationButton: 'false',
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').length).toEqual(0);
    });
  }));
});
