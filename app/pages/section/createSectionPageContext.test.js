import { createSectionPageContext } from './createSectionPageContext';

describe('createSectionPageContext', () => {
  it('should create a context with for the section', () => {
    const expectedContext = {
      title: 'Some section title',
      submitActionUrl: '/solution/some-solution-id/section/some-section-id',
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
      returnToDashboardUrl: '/solution/some-solution-id',
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

    const context = createSectionPageContext({
      solutionId: 'some-solution-id', sectionManifest,
    });

    expect(context).toEqual(expectedContext);
  });

  it('should create a context with errors for the section', () => {
    const expectedContext = {
      submitActionUrl: '/solution/some-solution-id/section/some-section-id',
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
      returnToDashboardUrl: '/solution/some-solution-id',
    };

    const formData = {
      fieldId: 'some existing data',
    };

    const validationErrors = {
      fieldId: 'maxLength',
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

    const context = createSectionPageContext({
      solutionId: 'some-solution-id', sectionManifest, formData, validationErrors,
    });

    expect(context).toEqual(expectedContext);
  });

  it('should create submitActionPath with the dashboardId provided', () => {
    const expectedContext = {
      submitActionUrl: '/solution/some-solution-id/dashboard/some-dashboard-id/section/some-section-id',
      questions: [
        {
          id: 'some-question-id',
        },
      ],
      returnToDashboardUrl: '/solution/some-solution-id',
    };

    const sectionManifest = {
      id: 'some-section-id',
      questions: {
        'some-question-id': {},
      },
    };

    const context = createSectionPageContext({
      solutionId: 'some-solution-id', sectionManifest, dashboardId: 'some-dashboard-id',
    });

    expect(context).toEqual(expectedContext);
  });
});
