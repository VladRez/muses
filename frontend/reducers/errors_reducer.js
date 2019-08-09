import { combineReducers } from "redux";

import session from "./session_errors_reducer";
import questions from "./question_errors_reducer";

export default combineReducers({
  session: session,
  questions: questions
});
