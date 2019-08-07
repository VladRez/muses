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
           <form onSubmit={this.handleSubmit} className='card'>
                <input 
                type="text" 
                placeholder="Answer Question..."
                value={this.state.answer_body}
                onChange={this.update('answer_body')}/>
                <input className="submitButton" type="submit" value="Submit"/>
           <textarea name="" id="" cols="30" rows="10"></textarea>
           </form>
        </div>)
    }
}

export default withRouter(AnswerQuestionForm);