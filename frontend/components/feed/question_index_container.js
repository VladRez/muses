import { connect } from "react-redux";
import { fetchQuestions } from "../../actions/question_actions";
import QuestionIndex from "./question_index";

const mapStateToProps = (state, ownProps) => {
  return {
    questions: Object.values(state.entities.questions)
  };
};

const mapDispatchToProps = disptach => {
  return {
    fetchQuestions: () => disptach(fetchQuestions())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionIndex);
