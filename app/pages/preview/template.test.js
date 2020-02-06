import { createTestHarness } from '../../test-utils/testHarness';

const setup = {
  template: {
    path: 'pages/preview/template.njk',
  },
};

describe('preview page', () => {
  it('should render the title of the preview page', createTestHarness(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      expect($('h1').text().trim()).toEqual('Preview Page');
    });
  }));

  it('should render the solutions-description section when provided', createTestHarness(setup, (harness) => {
    const context = {
      sections: {
        'solution-description': {},
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="view-solution-description"]').length).toEqual(1);
    });
  }));

  it('should render the features section when provided', createTestHarness(setup, (harness) => {
    const context = {
      sections: {
        features: {},
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="view-features"]').length).toEqual(1);
    });
  }));

  it('should render the client application types section when provided', createTestHarness(setup, (harness) => {
    const context = {
      sections: {
        'client-application-types': {},
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="view-client-application-types"]').length).toEqual(1);
    });
  }));

  it('should render the hosting types section when one of the sections is provided', createTestHarness(setup, (harness) => {
    const context = {
      sections: {
        'hosting-type-private-cloud': {},
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="view-hosting-types"]').length).toEqual(1);
    });
  }));
});
