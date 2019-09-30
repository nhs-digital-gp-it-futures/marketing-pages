import { determineStatusForSection } from './determineStatusForSection';

describe('determineStatusForSection', () => {
  it('should return a status of COMPLETE if some data has been provided', () => {
    const sectionData = {
      'some-section': [
        'Feature A',
        '',
        '',
      ],
    };

    const status = determineStatusForSection(sectionData);

    expect(status).toEqual('COMPLETE');
  });

  it('should return a status of COMPLETE if some data has been provided in one of the questions', () => {
    const sectionData = {
      'some-section': [
        '',
        '',
        '',
      ],
      'some-other-section': [
        '',
        'Feature A',
        '',
      ],
    };

    const status = determineStatusForSection(sectionData);

    expect(status).toEqual('COMPLETE');
  });

  it('should return a status of INCOMPLETE if np data has been provided', () => {
    const sectionData = {
      'some-section': [
        '',
        '',
        '',
      ],
    };

    const status = determineStatusForSection(sectionData);

    expect(status).toEqual('INCOMPLETE');
  });

  it('should return a status of INCOMPLETE if no data has been provided in any of the questions', () => {
    const sectionData = {
      'some-section': [
        '',
        '',
        '',
      ],
      'some-other-section': [
        '',
        '',
        '',
      ],
    };

    const status = determineStatusForSection(sectionData);

    expect(status).toEqual('INCOMPLETE');
  });
});
