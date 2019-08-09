import { connect } from "react-redux";
import CommentIndex from "./comment_index";

const mapStateToProps = (state, ownProps) => {
  let comments = Object.values(state.entities.comments).filter(
    cmnt => cmnt.answer_id == ownProps.answerId
  );
  let comment_authors = Object.values(state.entities.users).filter(user =>
    comments.map(comment => comment.comment_author_id).includes(user.id)
  );

  return {
    comments,
    comment_authors
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentIndex);
