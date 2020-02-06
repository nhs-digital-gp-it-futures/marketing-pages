const createRedirectUrl = ({
  solutionId, successfulSubmitResponsePath, userContextType,
}) => {
  const defaultUrl = `/${userContextType}/solution/${solutionId}`;

  if (successfulSubmitResponsePath) {
    return `${defaultUrl}/${successfulSubmitResponsePath}`;
  }

  return defaultUrl;
};

export const createPostSectionResponse = ({ solutionId, sectionManifest, userContextType = 'supplier' }) => {
  const response = {
    success: true,
    redirectUrl: createRedirectUrl({
      solutionId,
      successfulSubmitResponsePath: sectionManifest.successfulSubmitResponsePath,
      userContextType,
    }),
  };

  return response;
};
