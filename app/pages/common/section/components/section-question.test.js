import { componentTester } from '../../../../test-utils/componentTester';

const setup = {
  component: {
    name: 'sectionQuestion',
    path: 'pages/common/section/components/section-question.njk',
  },
};

describe('section-question', () => {
  describe('when question type is bulletpoint-list', () => {
    it('should render the bullepoint-list component', componentTester(setup, (harness) => {
      const context = {
        params: {
          question: {
            id: 'question-id',
            type: 'bulletpoint-list',
          },
        },
      };

      harness.request(context, ($) => {
        const question = $('div[data-test-id="section-question-bulletpoint-list"] > div');
        expect(question.length).toEqual(1);
      });
    }));
  });

  describe('when question type is textarea-field', () => {
    it('should render the textarea-field component', componentTester(setup, (harness) => {
      const context = {
        params: {
          question: {
            id: 'question-id',
            type: 'textarea-field',
          },
        },
      };

      harness.request(context, ($) => {
        const question = $('div[data-test-id="section-question-textarea-field"]');
        expect(question.length).toEqual(1);
      });
    }));
  });

  describe('when question type is textarea-field-no-count', () => {
    it('should render the textarea-field component', componentTester(setup, (harness) => {
      const context = {
        params: {
          question: {
            id: 'question-id',
            type: 'textarea-field-no-count',
          },
        },
      };

      harness.request(context, ($) => {
        const question = $('div[data-test-id="section-question-textarea-field-no-count"] > div');
        expect(question.length).toEqual(1);
      });
    }));
  });

  describe('when question type is text-field', () => {
    it('should render the text-field component', componentTester(setup, (harness) => {
      const context = {
        params: {
          question: {
            id: 'question-id',
            type: 'text-field',
          },
        },
      };

      harness.request(context, ($) => {
        const question = $('div[data-test-id="section-question-text-field"] > div');
        expect(question.length).toEqual(1);
      });
    }));
  });

  describe('when question type is checkbox-options', () => {
    it('should render the checkbox-options component', componentTester(setup, (harness) => {
      const context = {
        params: {
          question: {
            id: 'question-id',
            type: 'checkbox-options',
          },
        },
      };

      harness.request(context, ($) => {
        const question = $('div[data-test-id="section-question-checkbox-options"] > div');
        expect(question.length).toEqual(1);
      });
    }));
  });

  describe('when question type is radiobutton-options', () => {
    it('should render the radiobutton-options component', componentTester(setup, (harness) => {
      const context = {
        params: {
          question: {
            id: 'question-id',
            type: 'radiobutton-options',
          },
        },
      };

      harness.request(context, ($) => {
        const question = $('div[data-test-id="section-question-radiobutton-options"] > div');
        expect(question.length).toEqual(1);
      });
    }));
  });

  describe('when question type is combobox-options', () => {
    it('should render the combobox-options component', componentTester(setup, (harness) => {
      const context = {
        params: {
          question: {
            id: 'question-id',
            type: 'combobox-options',
          },
        },
      };

      harness.request(context, ($) => {
        const question = $('div[data-test-id="section-question-combobox-options"] > div');
        expect(question.length).toEqual(1);
      });
    }));
  });
});
