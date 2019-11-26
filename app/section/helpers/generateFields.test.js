import { generateFields } from './generateFields';

describe('generateFields', () => {
  it('should return undefined if question is undefined', () => {
    const expectedGeneratedFields = undefined;

    const questionManifest = undefined;

    const fields = generateFields('some-question-id', questionManifest);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should return undefined if maxItems property does not exist in question', () => {
    const expectedGeneratedFields = undefined;

    const questionManifest = {};

    const fields = generateFields('some-question-id', questionManifest);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should return undefined if maxItems property is 0', () => {
    const expectedGeneratedFields = undefined;

    const questionManifest = {
      maxItems: 0,
    };

    const fields = generateFields('some-question-id', questionManifest);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should create a list of 1 field if the question provided has a maxItems property of 1', () => {
    const expectedGeneratedFields = {
      fields: [
        {
          id: 'some-question-id-1',
        },
      ],
    };

    const questionManifest = {
      maxItems: 1,
    };

    const fields = generateFields('some-question-id', questionManifest);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should create a list of multiple fields if the question provided has a maxItems property of more than 1', () => {
    const expectedGeneratedFields = {
      fields: [
        {
          id: 'some-question-id-1',
        },
        {
          id: 'some-question-id-2',
        },
        {
          id: 'some-question-id-3',
        },
      ],
    };

    const questionManifest = {
      maxItems: 3,
    };

    const fields = generateFields('some-question-id', questionManifest);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should populate the fields with data when there is existing data available', () => {
    const expectedGeneratedFields = {
      fields: [
        {
          id: 'some-question-id-1',
          data: 'some-data-1',
        },
        {
          id: 'some-question-id-2',
          data: 'some-data-2',
        },
        {
          id: 'some-question-id-3',
        },
      ],
    };

    const questionManifest = {
      maxItems: 3,
    };

    const exisitingDataForSection = {
      'some-question-id': [
        'some-data-1', 'some-data-2',
      ],
    };

    const fields = generateFields('some-question-id', questionManifest, exisitingDataForSection);

    expect(fields).toEqual(expectedGeneratedFields);
  });

  it('should add the validation error message to the field', () => {
    const expectedGeneratedFields = {
      errors: [
        {
          text: 'some really helpful error message',
          href: '#some-question-id-2',
        },
      ],
      fields: [
        {
          id: 'some-question-id-1',
          data: 'some-data-1',
        },
        {
          id: 'some-question-id-2',
          data: 'some-really-large-data-2',
          error: {
            message: 'some really helpful error message',
          },
        },
        {
          id: 'some-question-id-3',
          data: 'some-data-3',
        },
      ],
    };

    const questionManifest = {
      maxItems: 3,
      errorResponse: {
        maxLength: 'some really helpful error message',
      },
    };

    const validationErrors = {
      maxLength: ['some-question-id-2'],
    };

    const exisitingDataForSection = {
      'some-question-id': [
        'some-data-1', 'some-really-large-data-2', 'some-data-3',
      ],
    };

    const fields = generateFields('some-question-id', questionManifest, exisitingDataForSection, validationErrors);

    expect(fields).toEqual(expectedGeneratedFields);
  });
});
