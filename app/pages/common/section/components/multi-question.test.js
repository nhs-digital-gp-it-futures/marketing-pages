import { componentTester } from '../../../../test-utils/componentTester';

const setup = {
  component: {
    name: 'multiQuestion',
    path: 'pages/common/section/components/multi-question.njk',
  },
};

describe('multi-question', () => {
  it('should render the main advice of the question', componentTester(setup, (harness) => {
    const context = {
      params: {
        parentQuestion: {
          id: 'fieldId',
          mainAdvice: 'main advice for question',
        },
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="multi-question-main-advice"]')
        .text().trim()).toEqual('main advice for question');
    });
  }));

  it('should render any additional advice', componentTester(setup, (harness) => {
    const context = {
      params: {
        parentQuestion: {
          id: 'fieldId',
          mainAdvice: 'main advice for question',
          additionalAdvice: 'some additional advice for question',
        },
      },
    };

    harness.request(context, ($) => {
      const additionalAdvice = $('[data-test-id="multi-question-additional-advice"]');
      expect(additionalAdvice.text().trim()).toEqual('some additional advice for question');
    });
  }));

  it('should render a single inner question', componentTester(setup, (harness) => {
    const context = {
      params: {
        parentQuestion: {
          id: 'fieldId',
          questions: [
            {
              id: 'fieldId[innerQuestionId]',
              type: 'text-field',
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="section-question-text-field"]').length).toEqual(1);
    });
  }));

  it('should render multiple inner question', componentTester(setup, (harness) => {
    const context = {
      params: {
        parentQuestion: {
          id: 'fieldId',
          questions: [
            {
              id: 'fieldId[innerQuestionId]',
              type: 'text-field',
            },
            {
              id: 'fieldId[anotherInnerQuestionId]',
              type: 'text-field',
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="section-question-text-field"]').length).toEqual(2);
    });
  }));
});
