export const createPreviewPageContext = ({ previewData }) => {
  let context = {
    sections: previewData.sections,
  };

  for(let key in context.sections)
  { 
    let section = context.sections[key];
    if(section.answers && section.answers['document-name'])
    {
      section.answers['document-link'] = "document/" + section.answers['document-name'];
    }
  };

  return context;
};