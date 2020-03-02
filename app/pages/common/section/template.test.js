import { createTestHarness } from '../../../test-utils/testHarness';

const setup = {
  template: {
    path: 'pages/common/section/template.njk',
  },
};

describe('section page', () => {
  it('should render the title of the section', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
    };

    harness.request(context, ($) => {
      expect($('h1[data-test-id="section-title"]').text().trim()).toEqual('Title of the section');
    });
  }));

  it('should render the main advice of the section', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
      mainAdvice: 'This is the main advice for this section',
    };

    harness.request(context, ($) => {
      expect($('h2[data-test-id="section-main-advice"]').text().trim()).toEqual('This is the main advice for this section');
    });
  }));

  it('should render any additional advice of the section', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
      additionalAdvice: [
        'First bit of addtional advice',
        'Second bit of addtional advice',
      ],
    };

    harness.request(context, ($) => {
      context.additionalAdvice.map((advice, idx) => {
        expect($(`div[data-test-id="section-additional-advice"] p:nth-child(${idx + 1})`).text().trim()).toEqual(advice);
      });
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

  it('should not render the error summary if no errors', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="error-summary"]').length).toEqual(0);
    });
  }));

  it('should render all the questions for the section', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
      questions: [
        { type: 'text-field' },
        { type: 'text-field' },
        { type: 'text-field' },
      ],
    };

    harness.request(context, ($) => {
      expect($('div[data-test-id="section-question-text-field"]').length).toEqual(3);
    });
  }));

  it('should render a multi-question', createTestHarness(setup, (harness) => {
    const context = {
      questions: [
        {
          id: 'parent-question-id',
          type: 'multi-question',
          questions: [
            {
              id: 'parent-question-id[inner-question-id]',
            },
          ],
        },
      ],
    };

    harness.request(context, ($) => {
      expect($('div[data-test-id="question-parent-question-id"]').length).toEqual(1);
    });
  }));

  it('should render a button to submit the form', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="section-submit-button"] button').length).toEqual(1);
    });
  }));

  it('should render the warning advise', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
      warningAdvice: 'Some warning advice',
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="section-warning-advice"]').length).toEqual(1);
      expect($('[data-test-id="section-warning-advice"] .nhsuk-u-visually-hidden').text().trim()).toEqual('Information:');
      expect($('[data-test-id="section-warning-advice"] p').text().trim()).toEqual('Some warning advice');
    });
  }));

  it('should render the return to all sections link', createTestHarness(setup, (harness) => {
    const context = {
      title: 'Title of the section',
    };

    harness.request(context, ($) => {
      console.log($.html())
      expect($('[data-test-id="section-back-link"] a').length).toEqual(1);
      expect($('[data-test-id="section-back-link"] a').text().trim()).toEqual('Return to all sections');
    });
  }));
});
