import csvtojson from 'csvtojson';

const formatStrategy = {
  capabilities: (csvRow) => csvRow['Capability ID'],
  epics: (csvRow) => (csvRow['Epic ID'] && csvRow['Epic Final Assessment Result'] ? ({
    'epic-id': csvRow['Epic ID'],
    'assessment-result': csvRow['Epic Final Assessment Result'],
  }) : undefined),
};

export const transformCsv = async ({ questionId, csv }) => {
  if (!csv.trim().length) return [];

  const json = await csvtojson({ trim: true, ignoreEmpty: true }).fromString(csv);
  return json.reduce((acc, csvRowJson) => {
    if (formatStrategy[questionId]) {
      const formattedValue = formatStrategy[questionId](csvRowJson);
      if (formattedValue) acc.push(formattedValue);
    }
    return acc;
  }, []);
};
