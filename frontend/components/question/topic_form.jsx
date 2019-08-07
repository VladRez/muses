import React from 'react';
import { withRouter } from "react-router";

class TopicForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.question
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();
     
    }


    handleChange(e) {
        let currentTopics =  this.props.question.topics
       currentTopics.push(e.target.value)
       this.setState({topics: currentTopics});
    }
    render() {


        const topicOptions = this.props.availableTopics.map(topic => {
            return <option key={topic.id} value={topic.id}>{topic.name}</option>
        })

        return (<div>
            <form onSubmit={this.handleSubmit}>
               
               
                   <select onChange={this.handleChange}>
                   {topicOptions}
                   </select>
               
               

                <input type="submit" value="Add Topic" />
            </form>
        </div>)
    }
}


export default withRouter(TopicForm);