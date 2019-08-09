import { fetchTopics } from "../../actions/topic_action";
import { fetchQuestions } from "../../actions/question_actions";
import TopicFeed from "./topic_feed";
import { connect } from "react-redux";
const mapStateToProps = (state, ownProps) => {
  let topics = [];
  if (ownProps.discussedTopics) {
    topics = Object.values(state.entities.topics).filter(topic =>
      ownProps.discussedTopics.includes(`${topic.id}`)
    );
  }
  return {
    topics
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTopics: () => dispatch(fetchTopics()),
    fetchQuestions: prms => dispatch(fetchQuestions(prms))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicFeed);
