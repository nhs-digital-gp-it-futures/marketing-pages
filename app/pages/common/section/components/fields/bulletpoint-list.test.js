import { componentTester } from '../../../../../test-utils/componentTester';

const setup = {
  component: {
    name: 'bulletpointList',
    path: 'pages/common/section/components/fields/bulletpoint-list.njk',
  },
};

describe('bulletpoint-list', () => {
  it('should render the main advice of the question', componentTester(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'main advice for question',
        },
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="bulletpoint-list-main-advice"]')
        .text().trim()).toEqual('main advice for question');
    });
  }));

  it('should render any additional advice', componentTester(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'main advice for question',
          additionalAdvice: 'some additional advice for question',
        },
      },
    };

    harness.request(context, ($) => {
      const additionalAdvice = $('[data-test-id="bulletpoint-list-additional-advice"]');
      expect(additionalAdvice.text().trim()).toEqual('some additional advice for question');
    });
  }));

  it('should render a single text field if context only contains a single field', componentTester(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          fields: [
            {
              id: 'fieldId-1',
              data: '',
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="field-fieldId-1"]').length).toEqual(1);
      expect($('[data-test-id="field-fieldId-2"]').length).toEqual(0);
    });
  }));

  it('should render multiple text if the context contains multiple fields', componentTester(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          fields: [
            {
              id: 'fieldId-1',
              data: '',
            },
            {
              id: 'fieldId-2',
              data: '',
            },
            {
              id: 'fieldId-3',
              data: '',
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="field-fieldId-1"]').length).toEqual(1);
      expect($('[data-test-id="field-fieldId-2"]').length).toEqual(1);
      expect($('[data-test-id="field-fieldId-3"]').length).toEqual(1);
      expect($('[data-test-id="field-fieldId-4"]').length).toEqual(0);
    });
  }));

  it('should render the text field as error if the context contains an error for the field', componentTester(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          fields: [
            {
              id: 'fieldId-1',
              data: 'good',
            },
            {
              id: 'fieldId-2',
              data: 'This is not good',
              error: {
                message: 'some error message',
              },
            },
            {
              id: 'fieldId-3',
              data: 'good',
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="field-fieldId-1"]').length).toEqual(1);
      expect($('[data-test-id="field-fieldId-2"]').length).toEqual(0);
      expect($('[data-test-id="field-error-fieldId-2"]').length).toEqual(1);
      expect($('[data-test-id="field-fieldId-3"]').length).toEqual(1);
    });
  }));

  it('should render the correct label classes if is part of a multi question', componentTester(setup, (harness) => {
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
      const mainAdviceLabel = $('div[data-test-id="bulletpoint-list-main-advice"] span');

      expect(mainAdviceLabel.hasClass('nhsuk-u-font-size-19')).toEqual(true);
      expect(mainAdviceLabel.hasClass('nhsuk-u-font-weight-bold')).toEqual(true);
      expect(mainAdviceLabel.hasClass('nhsuk-u-margin-bottom-2')).toEqual(true);
    });
  }));

  it('should render the correct label classes if is not part of a multi question', componentTester(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'main advice for question',
        },
      },
    };

    harness.request(context, ($) => {
      const mainAdviceLabel = $('div[data-test-id="bulletpoint-list-main-advice"] span');

      expect(mainAdviceLabel.hasClass('nhsuk-u-font-size-24')).toEqual(true);
      expect(mainAdviceLabel.hasClass('nhsuk-u-font-weight-bold')).toEqual(true);
      expect(mainAdviceLabel.hasClass('nhsuk-u-margin-bottom-2')).toEqual(true);
    });
  }));

  it('should not render any additional advice if not provided', componentTester(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'fieldId',
          mainAdvice: 'main advice for question',
        },
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="bulletpoint-list-additional-advice"]').length).toEqual(0);
    });
  }));

  it('should render the accessibility label for listing inputs', componentTester(setup, (harness) => {
    const context = {
      params: {
        question: {
          id: 'field',
          fields: [
            {
              id: 'field-1',
              data: '',
            },
            {
              id: 'field-2',
              data: '',
              error: true,
            },
            {
              id: 'field-3',
              data: '',
            },
          ],
        },
      },
    };

    harness.request(context, ($) => {
      expect($('[data-test-id="bulletpoint-list-fields"] label.nhsuk-u-visually-hidden').length).toEqual(3);
      expect($('[data-test-id="bulletpoint-list-fields"] label.nhsuk-u-visually-hidden')[0].children[0].data.trim()).toEqual('field 1');
      expect($('[data-test-id="bulletpoint-list-fields"] label.nhsuk-u-visually-hidden')[1].children[0].data.trim()).toEqual('field 2');
      expect($('[data-test-id="bulletpoint-list-fields"] label.nhsuk-u-visually-hidden')[2].children[0].data.trim()).toEqual('field 3');
    });
  }));
});
