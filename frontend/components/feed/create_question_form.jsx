import React from 'react';
import {withRouter} from 'react-router-dom';

class CreateQuestionForm extends React.Component {
    constructor(props){
        super(props);
        this.state = this.props.question
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    update(field){
        return (e) => {
            this.setState({[field]: e.target.value});
        }
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.action(this.state)
        // .then(cb)
        this.setState(this.props.question)
    }
    render () {
        return (<div>
           <form onSubmit={this.handleSubmit} className='card'>
                <input 
                type="text" 
                placeholder="What is your question or link?"
                value={this.state.question}
                onChange={this.update('question')}/>
                <input type="submit" value="Add Question"/>
           </form>
        </div>)
    }
}

export default CreateQuestionForm;