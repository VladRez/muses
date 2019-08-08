import React from 'react';
import { withRouter } from "react-router";

class EditQuestionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.question
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    update(field) {
        return (e) => {
            this.setState({[field]: e.target.value});
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.action(this.state)
    }
    render() {
        return (<div>
            <form onSubmit={this.handleSubmit} className='questionAnswerForm'>
                <input 
                type="text" 
                value={this.state.question}
                onChange={this.update('question')}/>
        
                <input className="submitButton" type="submit" value="Update" />

            </form>
        </div>)
    }
}

export default withRouter(EditQuestionForm);