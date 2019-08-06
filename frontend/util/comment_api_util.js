export const fetchAnswerComments = (questionId, answerId) => (
    $.ajax({
      method: 'GET',
      url: `/api/questions/${questionId}/answers/${answerId}/comments`
    })
  );
  
  
export const createAnswerComment = (questionId, answerId, comment) => (
  $.ajax({
    method: 'POST',
    url: `/api/questions/${questionId}/answers/${answerId}/comments`,
    data: {comment: comment}
  })
);