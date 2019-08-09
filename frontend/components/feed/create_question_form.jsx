import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import QuestionContainer from "../question/question_container";

class CreateQuestionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.question;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    return e => {
      this.setState({ [field]: e.target.value });
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.action(this.state);

    this.setState(this.props.question);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="askQuestionButton">
          <input
            className="askQuestionInput"
            type="text"
            placeholder="What is your question or link?"
            value={this.state.question}
            onChange={this.update("question")}
          />
          <input className="submitButton" type="submit" value="Add Question" />
        </form>
      </div>
    );
  }
}

export default CreateQuestionForm;
