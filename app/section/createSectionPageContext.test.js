import { createSectionPageContext } from './createSectionPageContext';

describe('createSectionPageContext', () => {
  it('should create a context with for the section', () => {
    const expectedContext = {
      title: 'Some section title',
      submitActionUrl: '/some-solution-id/section/some-section-id',
      mainAdvice: 'Some main advice.',
      additionalAdvice: [
        'Some first bit of additional advice.',
        'Some second bit of additional advice.',
        'Some third bit of additional advice.',
      ],
      questions: [
        {
          id: 'some-question-id',
        },
      ],
      returnToDashboardUrl: '/some-solution-id',
      submitText: 'some-submit-text',
    };

    const sectionManifest = {
      id: 'some-section-id',
      title: 'Some section title',
      mainAdvice: 'Some main advice.',
      additionalAdvice: [
        'Some first bit of additional advice.',
        'Some second bit of additional advice.',
        'Some third bit of additional advice.',
      ],
      questions: {
        'some-question-id': {},
      },
      submitText: 'some-submit-text',
    };

    const context = createSectionPageContext('some-solution-id', sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context with errors for the section', () => {
    const expectedContext = {
      submitActionUrl: '/some-solution-id/section/some-section-id',
      errors: [
        {
          text: 'some really helpful error message',
          href: '#fieldId',
        },
      ],
      questions: [
        {
          id: 'fieldId',
          type: 'textarea-field',
          data: 'some existing data',
          error: {
            message: 'some really helpful error message',
          },
        },
      ],
      returnToDashboardUrl: '/some-solution-id',
    };

    const formData = {
      fieldId: 'some existing data',
    };

    const validationErrors = {
      maxLength: ['fieldId'],
    };

    const sectionManifest = {
      id: 'some-section-id',
      questions: {
        fieldId: {
          type: 'textarea-field',
          errorResponse: {
            maxLength: 'some really helpful error message',
          },
        },
      },
    };

    const context = createSectionPageContext('some-solution-id', sectionManifest, formData, validationErrors);

    expect(context).toEqual(expectedContext);
  });
});
