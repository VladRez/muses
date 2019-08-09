import { connect } from "react-redux";
import TopicIndex from "./topic_index";
import { fetchTopics } from "../../actions/topic_action";
import { fetchQuestions } from "../../actions/question_actions";
const mapStateToProps = (state, ownProps) => {
  let qtopics = [];

  let availableTopics = [];
  if (!ownProps.questionTopics.includes(undefined)) {
    qtopics = ownProps.questionTopics.map(qt => `${qt.id}`);
    availableTopics = Object.values(state.entities.topics).filter(
      topic => !qtopics.includes(`${topic.id}`)
    );
  }
  return {
    availableTopics
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchQuestions: prms => dispatch(fetchQuestions(prms))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicIndex);
