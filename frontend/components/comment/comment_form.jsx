import React from "react";
import { withRouter } from "react-router";

class CommentAnswerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.default_comment;

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    return e => {
      this.setState({ [field]: e.target.value });
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    let qId = this.props.match.params.question_id;
    let aId = this.props.default_comment.answer_id;
    this.props.action(qId, aId, this.state);
    this.setState(this.props.default_comment);
  }
  render() {
    return (
      <div className="addCommentGroup">
        <div className="addCommentProfileAvatar">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfBY-Rgh-5AduJ15F_FBljvzkeEdOTRuAWavFEC0XzNPrQoPYdLg" />
        </div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            className="addCommentInput"
            onChange={this.update("comment_body")}
            value={this.state.comment_body}
            placeholder="Add a Comment"
          />
          <input
            type="submit"
            className="submitButton addCommentButton"
            value="Add Comment"
          />
        </form>
      </div>
    );
  }
}

export default withRouter(CommentAnswerForm);
