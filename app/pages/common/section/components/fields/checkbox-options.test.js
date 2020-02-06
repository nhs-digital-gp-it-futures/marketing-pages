import { createTestHarness } from '../../../../../test-utils/testHarness';

const setup = {
  component: {
    name: 'checkboxOptions',
    path: 'pages/common/section/components/fields/checkbox-options.njk',
  },
};

describe('checkboxOptions', () => {
  it('should render the main advice', createTestHarness(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'Some really important main advice',
          additionalAdvice: 'Some not so important additional advice',
        },
      },
    };

    harness.request(context, ($) => {
      const question = $('div[data-test-id="question-fieldId"]');
      expect(question.find('.nhsuk-fieldset__legend').text().trim()).toEqual('Some really important main advice');
    });
  }));

  it('should render the additional advice', createTestHarness(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'Some really important main advice',
          additionalAdvice: 'Some not so important additional advice',
        },
      },
    };

    harness.request(context, ($) => {
      const question = $('div[data-test-id="question-fieldId"]');
      expect(question.find('.nhsuk-hint').text().trim()).toEqual('Some not so important additional advice');
    });
  }));

  it('should render the checkbox options', createTestHarness(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'Some really important main advice',
          additionalAdvice: 'Some not so important additional advice',
          options: [
            {
              value: 'first-option',
              text: 'First Option',
            },
            {
              value: 'second-option',
              text: 'Second Option',
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      const question = $('div[data-test-id="question-fieldId"]');
      expect(question.find('.nhsuk-checkboxes__item').length).toEqual(2);
      expect(question.find('.nhsuk-checkboxes__item:nth-child(1)').find('input').attr('value')).toEqual('first-option');
      expect(question.find('.nhsuk-checkboxes__item:nth-child(2)').find('input').attr('value')).toEqual('second-option');
    });
  }));

  it('should render the checked checkbox option', createTestHarness(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'Some really important main advice',
          additionalAdvice: 'Some not so important additional advice',
          options: [
            {
              value: 'first-option',
              text: 'First Option',
            },
            {
              value: 'second-option',
              text: 'Second Option',
              checked: true,
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      const question = $('div[data-test-id="question-fieldId"]');
      expect(question.find('.nhsuk-checkboxes__item').length).toEqual(2);
      expect(question.find('.nhsuk-checkboxes__item:nth-child(1)').find('input').attr('checked')).toBeUndefined();
      expect(question.find('.nhsuk-checkboxes__item:nth-child(1)').find('input').attr('value')).toEqual('first-option');
      expect(question.find('.nhsuk-checkboxes__item:nth-child(2)').find('input').attr('checked')).toEqual('checked');
      expect(question.find('.nhsuk-checkboxes__item:nth-child(2)').find('input').attr('value')).toEqual('second-option');
    });
  }));

  it('should render the checkbox option as an error if the context provided contains an error', createTestHarness(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'Some really important main advice',
          additionalAdvice: 'Some not so important additional advice',
          options: [
            {
              value: 'first-option',
              text: 'First Option',
            },
            {
              value: 'second-option',
              text: 'Second Option',
              checked: true,
            },
          ],
          error: {
            message: 'Some error message',
          },
        },
      },
    };

    harness.request(context, ($) => {
      const question = $('div[data-test-id="question-fieldId"]');
      expect(question.find('div[data-test-id="checkbox-options-error"]').length).toEqual(1);
      expect(question.find('.nhsuk-error-message').text().trim()).toEqual('Error: Some error message');
    });
  }));
});
