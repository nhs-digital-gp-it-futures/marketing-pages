import { createTestHarness } from '../../../test-utils/testHarness';

const setup = {
  template: {
    path: 'pages/supplier/dashboard/template.njk',
  },
};

describe('supplier - dashboard page', () => {
  it('should render the title of the dashboard page', createTestHarness(setup, (harness) => {
    const context = {
      title: 'some title',
    };

    harness.request(context, ($) => {
      expect($('h1').text().trim()).toEqual('some title');
    });
  }));

  it('should render the error summary if errors', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
      errors: [{}],
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="error-summary"]').length).toEqual(1);
    });
  }));

  it('should render the preview button at the top of the page', createTestHarness(setup, (harness) => {
    const context = {
      previewUrl: '/solution/S100000-001/preview',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-preview-button"] a').length).toEqual(1);
      expect($('[data-test-id="dashboard-preview-button"] a').text().trim()).toEqual('Preview your page');
      expect($('[data-test-id="dashboard-preview-button"] a').attr('href')).toEqual('/solution/S100000-001/preview');
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

  it('should render the Submit for moderation button at the bottom of the page', createTestHarness(setup, (harness) => {
    const context = {
      submitForModerationUrl: '/supplier/solution/S100000-001/submitForModeration',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').length).toEqual(1);
      expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').text().trim()).toEqual('Submit for moderation');
      expect($('[data-test-id="dashboard-submit-for-moderation-button"] a').attr('href')).toEqual('/supplier/solution/S100000-001/submitForModeration');
    });
  }));
});
