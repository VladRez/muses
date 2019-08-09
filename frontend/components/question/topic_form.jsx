import React from "react";
import { withRouter } from "react-router";

class TopicForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.question;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let dropDownIdx = e.target["topics_drop_down"].selectedIndex;
    let topicIdx = this.props.availableTopics[dropDownIdx].id;

    let topics = this.props.question.topics;
    topics.push(topicIdx);
    let updatedQuestion = Object.assign({}, this.props.question, { topics });
    this.props.action(updatedQuestion);
  }

  handleChange(e) {
    //     let currentTopics =  this.props.question.topics
    //    currentTopics.push(e.target.value)
    //    this.setState({topics: currentTopics});
  }

  render() {
    const topicOptions = this.props.availableTopics.map(topic => {
      return (
        <option key={topic.id} value={topic.id}>
          {topic.name}
        </option>
      );
    });

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <select
            className="topics_drop_down"
            name="topics_drop_down"
            defaultValue={"DEFAULT"}
            onChange={this.handleChange}
          >
            {topicOptions}
          </select>

          <input
            type="submit"
            style={{ padding: 5 + `px` }}
            className="submitButton"
            value="Add Topic"
          />
        </form>
      </div>
    );
  }
}

export default withRouter(TopicForm);
