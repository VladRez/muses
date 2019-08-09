export const fetchQuestionAnswers = questionId =>
  $.ajax({
    method: "GET",
    url: `/api/questions/${questionId}/answers`
  });

export const createQuestionAnswer = (questionId, answer) =>
  $.ajax({
    method: "POST",
    url: `/api/questions/${questionId}/answers`,
    data: { answer: answer }
  });
