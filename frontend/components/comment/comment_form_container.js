import { connect } from "react-redux";
import CommentAnswerForm from "./comment_form";
import { createComment } from "../../actions/comment_actions";

const mapStateToProps = (state, ownProps) => {
  return {
    default_comment: {
      comment_body: "",
      answer_id: ownProps.answerId,
      comment_author_id: state.session.id
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    action: (questionId, answerId, comment) =>
      dispatch(createComment(questionId, answerId, comment))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentAnswerForm);
