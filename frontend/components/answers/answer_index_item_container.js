import { connect } from "react-redux";
import { timeDate } from "../../util/selector_util";
import AnswerIndexItem from "./answer_index_item";

const mapStateToProps = (state, ownProps) => {
  let date = timeDate(ownProps.answer.created_at);
  return {
    user: state.entities.users[ownProps.answer.answer_author_id],
    date
  };
};

const mapDispatchToProps = disptach => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnswerIndexItem);
