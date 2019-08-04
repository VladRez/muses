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
  
  export const createQuestion = (question) => (
    $.ajax({
      method: 'POST',
      url: '/api/questions',
      data: {question: question}
    })
  );

  export const filterQuestions = (questions, query) => {
    

    for(let k in questions) {
      let question = questions[k].question
      if (!question.includes(query)){
        delete questions[k]
      }
    }
    
    return questions
  }