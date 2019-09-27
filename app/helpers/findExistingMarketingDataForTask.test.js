import { findExistingMarketingDataForTask } from './findExistingMarketingDataForTask';

describe('findExistingMarketingDataForTask', () => {
  it('should return undefined when the existingSolutionData provided is undefined', () => {
    const existingSolutionData = undefined;

    const foundExistingData = findExistingMarketingDataForTask(existingSolutionData, 'some-id');

    expect(foundExistingData).toEqual(undefined);
  });

  it('should return undefined when the existingSolutionData provided has no marketing data', () => {
    const existingSolutionData = {};

    const foundExistingData = findExistingMarketingDataForTask(existingSolutionData, 'some-id');

    expect(foundExistingData).toEqual(undefined);
  });

  it('should return undefined when the existingSolutionData provided has no sections', () => {
    const existingSolutionData = { marketingData: {} };

    const foundExistingData = findExistingMarketingDataForTask(existingSolutionData, 'some-id');

    expect(foundExistingData).toEqual(undefined);
  });

  it('should return undefined when the task is not found in the existingSolutionData provided', () => {
    const existingSolutionData = { marketingData: { sections: [{ id: 'some-id' }] } };

    const foundExistingData = findExistingMarketingDataForTask(existingSolutionData, 'some-other-id');

    expect(foundExistingData).toEqual(undefined);
  });

  it('should return the task when the task is found in the existingSolutionData provided', () => {
    const expectedFoundTask = { id: 'found-id' };

    const existingSolutionData = { marketingData: { sections: [{ id: 'found-id' }] } };

    const foundExistingData = findExistingMarketingDataForTask(existingSolutionData, 'found-id');

    expect(foundExistingData).toEqual(expectedFoundTask);
  });
});
