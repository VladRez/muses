import React from 'react'
import QuestionIndexItem from './question_index_item'
import CreateQuestionFormContainer from './create_question_form_container'

class QuestionIndex extends React.Component {
    componentDidMount() {
        this.props.fetchQuestions()
    }

    render() {
        const questions = this.props.questions.map((question, idx) => {
            return <QuestionIndexItem key={idx} question={question} />
        })

        return (<div className="layout3ColCenter">
            <div className="addQuestionPrompt">
                <div className="userAsksHeader">
                    <CreateQuestionFormContainer />
                </div>
            </div>
                {questions}
        </div>)
    }
}

export default QuestionIndex