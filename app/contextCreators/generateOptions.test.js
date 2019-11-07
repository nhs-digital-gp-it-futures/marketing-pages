import { generateOptions } from './generateOptions';

describe('generateOptions', () => {
  it.skip('should return undefined if question is undefined', () => {
    const expectedGeneratedFields = undefined;

    const questionManifest = undefined;

    const fields = generateOptions('some-question-id', questionManifest);

    expect(fields).toEqual(expectedGeneratedFields);
  });
});
