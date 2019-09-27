import { findExistingMarketingDataForSection } from './findExistingMarketingDataForSection';

describe('findExistingMarketingDataForSection', () => {
  it('should return undefined when the existingSolutionData provided is undefined', () => {
    const existingSolutionData = undefined;

    const foundExistingData = findExistingMarketingDataForSection(existingSolutionData, 'some-id');

    expect(foundExistingData).toEqual(undefined);
  });

  it('should return undefined when the existingSolutionData provided has no marketing data', () => {
    const existingSolutionData = {};

    const foundExistingData = findExistingMarketingDataForSection(existingSolutionData, 'some-id');

    expect(foundExistingData).toEqual(undefined);
  });

  it('should return undefined when the existingSolutionData provided has no sections', () => {
    const existingSolutionData = { marketingData: {} };

    const foundExistingData = findExistingMarketingDataForSection(existingSolutionData, 'some-id');

    expect(foundExistingData).toEqual(undefined);
  });

  it('should return undefined when the section is not found in the existingSolutionData provided', () => {
    const existingSolutionData = { marketingData: { sections: [{ id: 'some-id' }] } };

    const foundExistingData = findExistingMarketingDataForSection(existingSolutionData, 'some-other-id');

    expect(foundExistingData).toEqual(undefined);
  });

  it('should return the section when the section is found in the existingSolutionData provided', () => {
    const expectedFoundSection = { id: 'found-id' };

    const existingSolutionData = { marketingData: { sections: [{ id: 'found-id' }] } };

    const foundExistingData = findExistingMarketingDataForSection(existingSolutionData, 'found-id');

    expect(foundExistingData).toEqual(expectedFoundSection);
  });
});
