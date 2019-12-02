export const commonQuestionContext = (
  questionId, questionManifest, parentQuestionId,
) => ({
  id: parentQuestionId ? `${parentQuestionId}[${questionId}]` : questionId,
  type: questionManifest.type,
  mainAdvice: questionManifest.mainAdvice,
  additionalAdvice: questionManifest.additionalAdvice,
  footerAdvice: questionManifest.footerAdvice,
});
