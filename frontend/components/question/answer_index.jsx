import React from 'react'
import AnswerIndexItemContainer from './answer_index_item_container'


class AnswerIndex extends React.Component {

    
    render() {
        
        let answers = this.props.answers.map(answer => {
       
            return <AnswerIndexItemContainer key={answer.id} answer={answer} />
        })

        return (<div>{answers}</div>)
    }
}

export default AnswerIndex
