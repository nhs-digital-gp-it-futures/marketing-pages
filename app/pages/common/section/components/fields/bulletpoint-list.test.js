import { createTestHarness } from '../../../../../test-utils/testHarness';

const setup = {
  component: {
    name: 'bulletpointList',
    path: 'pages/supplier/section/components/fields/bulletpoint-list.njk',
  },
};

describe('bulletpoint-list', () => {
  it('should render the main advice of the question', createTestHarness(setup, (harness) => {
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

  it('should render any additional advice', createTestHarness(setup, (harness) => {
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

  it('should render a single text field if context only contains a single field', createTestHarness(setup, (harness) => {
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

  it('should render multiple text if the context contains multiple fields', createTestHarness(setup, (harness) => {
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

  it('should render the text field as error if the context contains an error for the field', createTestHarness(setup, (harness) => {
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
});
