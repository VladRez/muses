import React from 'react'

class QuestionIndex extends React.Component {
    componentDidMount() {
       
    }

    render() {
        const questions = this.props.questions.map((question, idx)=>{
            return <li key={idx}>{JSON.stringify(question)}</li>
        })
        return (<div>
            <ul>
                {questions}
            </ul>
        </div>)
    }
}

export default QuestionIndex