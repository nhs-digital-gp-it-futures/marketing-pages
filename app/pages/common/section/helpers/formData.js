export const getFormDataValue = ({ key, formData }) => (formData ? formData[key] : undefined);

export const doesFormDataContainValue = ({ key, value, formData }) => {
  const formDataValue = getFormDataValue({ key, formData });
  if (Array.isArray(formDataValue)) {
    return formDataValue.some((data) => data === value);
  }

  return formDataValue === value;
};
