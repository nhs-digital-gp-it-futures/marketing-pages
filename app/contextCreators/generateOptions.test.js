import { generateOptions } from './generateOptions';

describe('generateOptions', () => {
  it('should return undefined if an option manifest is not provided', () => {
    const expectedOptions = undefined;

    const optionsManifest = undefined;

    const options = generateOptions('some-question-id', optionsManifest);

    expect(options).toEqual(expectedOptions);
  });
});
