import { createSectionPageContext } from './createSectionPageContext';

describe('createSectionPageContext', () => {
  it('should create a context from the section manifest', () => {
    const expectedContext = {
      title: 'Features',
      submitActionUrl: '/some-solution-id/section/features',
      questions: [
        {
          id: 'features-listing',
          mainAdvice: 'Add up to 10 features that describe your Solution.',
          additionalAdvice: [
            'Each feature will be displayed as a bulleted list item. For example:',
            '- Create and change appointment entries',
            'You can enter up to 100 characters per feature',
          ],
        },
      ],
    };

    const sectionManifest = {
      id: 'features',
      title: 'Features',
      questions: [
        {
          id: 'features-listing',
          mainAdvice: 'Add up to 10 features that describe your Solution.',
          additionalAdvice: [
            'Each feature will be displayed as a bulleted list item. For example:',
            '- Create and change appointment entries',
            'You can enter up to 100 characters per feature',
          ],
        },
      ],
    };

    const context = createSectionPageContext('some-solution-id', sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for bulletpoint-list type question', () => {
    const expectedContext = {
      submitActionUrl: '/some-solution-id/section/some-section-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          fields: [
            {
              id: 'fieldId-1',
            },
            {
              id: 'fieldId-2',
            },
            {
              id: 'fieldId-3',
            },
          ],
        },
      ],
    };

    const sectionManifest = {
      id: 'some-section-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          maxItems: 3,
        },
      ],
    };

    const context = createSectionPageContext('some-solution-id', sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for bulletpoint-list type question with existing data populated', () => {
    const expectedContext = {
      submitActionUrl: '/some-solution-id/section/some-section-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          fields: [
            {
              id: 'fieldId-1',
              data: 'Field A',
            },
            {
              id: 'fieldId-2',
              data: 'Field B',
            },
            {
              id: 'fieldId-3',
              data: 'Field C',
            },
          ],
        },
      ],
    };

    const formData = {
      data: {
        fieldId: [
          'Field A',
          'Field B',
          'Field C',
        ],
      },
    };

    const sectionManifest = {
      id: 'some-section-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          maxItems: 3,
        },
      ],
    };

    const context = createSectionPageContext('some-solution-id', sectionManifest, formData);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for bulletpoint-list type question with existing data populated', () => {
    const expectedContext = {
      submitActionUrl: '/some-solution-id/section/some-section-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          fields: [
            {
              id: 'fieldId-1',
              data: 'Field A',
            },
            {
              id: 'fieldId-2',
              data: 'Field B is too big',
              error: {
                message: 'some really helpful error message',
              },
            },
            {
              id: 'fieldId-3',
              data: 'Field C',
            },
          ],
        },
      ],
    };

    const formData = {
      data: {
        fieldId: [
          'Field A',
          'Field B is too big',
          'Field C',
        ],
      },
    };

    const validationErrors = [
      {
        questionId: 'fieldId',
        fieldId: 'fieldId-2',
        message: 'some really helpful error message',
      },
    ];

    const sectionManifest = {
      id: 'some-section-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          maxItems: 3,
          saveValidations: [
            {
              type: 'maxLength',
              maxLength: 10,
              message: 'some really helpful error message',
            },
          ],
        },
      ],
    };

    const context = createSectionPageContext('some-solution-id', sectionManifest, formData, validationErrors);

    expect(context).toEqual(expectedContext);
  });
});