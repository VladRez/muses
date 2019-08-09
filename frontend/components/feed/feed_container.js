import { connect } from "react-redux";
import { receiveAllQuestions } from "../../actions/question_actions";
import Feed from "./feed";

const mapStateToProps = (state, ownProps) => {
  let qsts = state.entities.questions;
  let topics = [];
  if (Object.values(qsts).length) {
    topics = Object.values({
      ...Object.values(state.entities.questions)
        .map(qst => qst.topics)
        .flat()
    });
  }
  return {
    discussedTopics: topics
  };
};

const mapDispatchToProps = disptach => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);
