import { connect } from "react-redux";
import EditQuestionForm from "./edit_question_form";
import { updateQuestion } from "../../actions/question_actions";

const mapStateToProps = (state, ownProps) => {
  return {
    question: ownProps.question
  };
};

const mapDispatchToProps = dispatch => {
  return {
    action: question => dispatch(updateQuestion(question))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditQuestionForm);
