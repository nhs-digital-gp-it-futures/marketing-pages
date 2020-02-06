import { createTestHarness } from '../../../../../test-utils/testHarness';

const setup = {
  component: {
    name: 'radiobuttonOptions',
    path: 'pages/common/section/components/fields/radiobutton-options.njk',
  },
};

describe('radiobuttonOptions', () => {
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
      expect($('.nhsuk-fieldset__legend').text().trim()).toEqual('Some really important main advice');
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

  it('should render the radio button options', createTestHarness(setup, (harness) => {
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
      expect(question.find('.nhsuk-radios__item').length).toEqual(2);
      expect(question.find('.nhsuk-radios__item:nth-child(1)').find('input').attr('value')).toEqual('first-option');
      expect(question.find('.nhsuk-radios__item:nth-child(2)').find('input').attr('value')).toEqual('second-option');
    });
  }));

  it('should render the checked radio button option', createTestHarness(setup, (harness) => {
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
      expect(question.find('.nhsuk-radios__item').length).toEqual(2);
      expect(question.find('.nhsuk-radios__item:nth-child(1)').find('input').attr('checked')).toBeUndefined();
      expect(question.find('.nhsuk-radios__item:nth-child(1)').find('input').attr('value')).toEqual('first-option');
      expect(question.find('.nhsuk-radios__item:nth-child(2)').find('input').attr('checked')).toEqual('checked');
      expect(question.find('.nhsuk-radios__item:nth-child(2)').find('input').attr('value')).toEqual('second-option');
    });
  }));

  it('should render the radiobutton option as an error if the context provided contains an error', createTestHarness(setup, (harness) => {
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
          error: {
            message: 'Some error message',
          },
        },
      },
    };

    harness.request(context, ($) => {
      const question = $('div[data-test-id="question-fieldId"]');
      expect(question.find('.nhsuk-error-message').text().trim()).toEqual('Error: Some error message');
      expect(question.find('div[data-test-id="radiobutton-options-error"]').length).toEqual(1);
    });
  }));
});
