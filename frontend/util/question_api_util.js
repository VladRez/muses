export const fetchQuestions = () => (
    $.ajax({
      method: 'GET',
      url: '/api/questions'
    })
  );
  
  export const fetchQuestion = (id) => (
    $.ajax({
      method: 'GET',
      url: `/api/questions/${id}`
    })
  );
  
  export const createQuestion = (data) => (
    $.ajax({
      method: 'POST',
      url: '/api/session',
      data: data
    })
  );