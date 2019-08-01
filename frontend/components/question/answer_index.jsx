import React from 'react'
import AnswerIndexItemContainer from './answer_index_item_container'
import AnswerFormContainer from './answer_form_container'

class AnswerIndex extends React.Component {

    
    render() {
        
        let answers = this.props.answers.map(answer => {
       
            return <AnswerIndexItemContainer key={answer.id} answer={answer} />
        })

        return (<div>
            <AnswerFormContainer/>
            <hr/>
            {answers}
            </div>)
    }
}

export default AnswerIndex
