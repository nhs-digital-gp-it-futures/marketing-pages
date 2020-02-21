import { createTestHarness } from '../../../../../test-utils/testHarness';

const setup = {
  component: {
    name: 'comboboxOptions',
    path: 'pages/common/section/components/fields/combobox-options.njk',
  },
};

describe('comboboxOptions', () => {
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
      expect($('.nhsuk-label').text().trim()).toEqual('Some really important main advice');
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
      expect($('.nhsuk-hint').text().trim()).toEqual('Some not so important additional advice');
    });
  }));

  it('should render the combo box', createTestHarness(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'Some really important main advice',
          additionalAdvice: 'Some not so important additional advice',
          options: [],
        },
      },
    };

    harness.request(context, ($) => {
      const comboboxComponent = $('[data-test-id=question-fieldId]');
      const combobox = comboboxComponent.find('select');

      expect(combobox.length).toEqual(1);
      expect(combobox.find('option').length).toEqual(0);
    });
  }));

  it('should render the combo box with options', createTestHarness(setup, (harness) => {
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
      const comboboxComponent = $('[data-test-id=question-fieldId]');
      const combobox = comboboxComponent.find('select');

      expect(combobox.find('option').length).toEqual(2);
      expect(combobox.find('option:nth-child(1)').attr('value')).toEqual('first-option');
      expect(combobox.find('option:nth-child(1)').text().trim()).toEqual('First Option');
      expect(combobox.find('option:nth-child(2)').attr('value')).toEqual('second-option');
      expect(combobox.find('option:nth-child(2)').text().trim()).toEqual('Second Option');
    });
  }));

  it('should render the combo box with a selected option', createTestHarness(setup, (harness) => {
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
              selected: true,
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      const comboboxComponent = $('[data-test-id=question-fieldId]');
      const combobox = comboboxComponent.find('select');

      expect(combobox.find('option').length).toEqual(2);
      expect(combobox.find('option:nth-child(1)').attr('value')).toEqual('first-option');
      expect(combobox.find('option:nth-child(1)').attr('selected')).toBeUndefined();
      expect(combobox.find('option:nth-child(2)').attr('value')).toEqual('second-option');
      expect(combobox.find('option:nth-child(2)').attr('selected')).toEqual('selected');
    });
  }));

  it('should render the combo box with a disabled option', createTestHarness(setup, (harness) => {
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
              disabled: true,
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      const comboboxComponent = $('[data-test-id=question-fieldId]');
      const combobox = comboboxComponent.find('select');

      expect(combobox.find('option').length).toEqual(2);
      expect(combobox.find('option:nth-child(1)').attr('value')).toEqual('first-option');
      expect(combobox.find('option:nth-child(1)').attr('disabled')).toBeUndefined();
      expect(combobox.find('option:nth-child(2)').attr('value')).toEqual('second-option');
      expect(combobox.find('option:nth-child(2)').attr('disabled')).toEqual('disabled');
    });
  }));

  it('should render the combo box with an error if the context provided contains an error', createTestHarness(setup, (harness) => {
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
              disabled: true,
            },
          ],
          error: {
            message: 'Some error message',
          },
        },
      },
    };

    harness.request(context, ($) => {
      const comboboxComponent = $('[data-test-id=question-fieldId]');

      expect(comboboxComponent.length).toEqual(1);
      expect(comboboxComponent.find('select.nhsuk-select--error').length).toEqual(1);
      expect(comboboxComponent.find('.nhsuk-error-message').text().trim()).toEqual('Error: Some error message');
    });
  }));

  it('should render the correct label classes if is part of a multi question', createTestHarness(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'main advice for question',
        },
        isMultiQuestion: true,
      },
    };

    harness.request(context, ($) => {
      const mainAdviceLabel = $('div[data-test-id="combobox-options"] label');

      expect(mainAdviceLabel.hasClass('nhsuk-u-font-size-19')).toEqual(true);
      expect(mainAdviceLabel.hasClass('nhsuk-u-font-weight-bold')).toEqual(true);
      expect(mainAdviceLabel.hasClass('nhsuk-u-margin-bottom-2')).toEqual(true);
    });
  }));

  it('should render the correct label classes if is not part of a multi question', createTestHarness(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'main advice for question',
        },
      },
    };

    harness.request(context, ($) => {
      const mainAdviceLabel = $('div[data-test-id="combobox-options"] label');

      expect(mainAdviceLabel.hasClass('nhsuk-u-font-size-24')).toEqual(true);
      expect(mainAdviceLabel.hasClass('nhsuk-u-font-weight-bold')).toEqual(true);
      expect(mainAdviceLabel.hasClass('nhsuk-u-margin-bottom-2')).toEqual(true);
    });
  }));

  it('should not render any additional advice if not provided', createTestHarness(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'main advice for question',
        },
      },
    };

    harness.request(context, ($) => {
      expect($('div[data-test-id="combobox-options"] .nhsuk-hint').length).toEqual(0);
    });
  }));
});
