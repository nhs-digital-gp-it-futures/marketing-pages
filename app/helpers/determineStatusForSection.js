export const determineStatusForSection = (sectionData) => {
  let status = 'INCOMPLETE';

  Object.values(sectionData)
    .map((values) => {
      values.map((value) => {
        if (value.trim().length > 0) {
          status = 'COMPLETE';
        }
      });
    });

  return status;
};
