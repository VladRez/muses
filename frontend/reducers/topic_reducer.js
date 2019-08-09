import { RECEIVE_ALL_TOPICS } from "../actions/topic_action";

const _nullTopics = Object.freeze({});

const topicReducer = (state = _nullTopics, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_ALL_TOPICS:
      return Object.assign({}, action.topics);
    default:
      return state;
  }
};

export default topicReducer;
