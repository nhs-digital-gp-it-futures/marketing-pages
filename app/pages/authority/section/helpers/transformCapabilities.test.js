import { csvCapabilityTransformation } from './transformCapabilities';

describe('transformCapabilities', () => {
  it('should transform an empty csv to an empty array', () => {
    const expectedTransform = [];

    const csv = '';

    const transformedData = csvCapabilityTransformation(csv);

    expect(transformedData).toEqual(expectedTransform);
  });

  it('should transform an single csv capability mapping', () => {
    const expectedTransform = ['C1'];

    const csv = 'solution-id,capability-ref\n10000-001,C1';

    const transformedData = csvCapabilityTransformation(csv);

    expect(transformedData).toEqual(expectedTransform);
  });
});
