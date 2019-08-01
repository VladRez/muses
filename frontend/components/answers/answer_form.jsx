import React from 'react';
import { withRouter } from "react-router";

class AnswerQuestionForm extends React.Component {
    constructor(props){
        super(props);
       this.state = this.props.answer
       this.handleSubmit = this.handleSubmit.bind(this)
       
    }

    update(field){
        return (e) => {
            this.setState({[field]: e.target.value});
        }
    }

    handleSubmit(e){
        e.preventDefault();
        
        
        let qId = this.props.match.params.question_id
        this.props.action(qId, this.state)
        this.setState(this.props.answer)
    }
    render () {
        return (<div>
           <form onSubmit={this.handleSubmit}>
                <input 
                type="text" 
                placeholder="Answer Question..."
                value={this.state.answer_body}
                onChange={this.update('answer_body')}/>
                <input type="submit" value="Submit"/>
           </form>
        </div>)
    }
}

export default withRouter(AnswerQuestionForm);