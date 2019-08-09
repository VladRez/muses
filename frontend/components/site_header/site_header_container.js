import { connect } from "react-redux";

import { logout } from "../../actions/session_actions";
import { searchQuestion, fetchQuestions } from "../../actions/question_actions";
import SiteHeader from "./site_header";

const mapStateToProps = (state, ownProps) => {
  let questions = Object.values(state.entities.questions);

  return {
    currentUser: state.session.id === null ? undefined : state.session.id,
    questions
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  search: (questions, query) => dispatch(searchQuestion(questions, query)),
  fetchQuestions: prms => dispatch(fetchQuestions(prms))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteHeader);
