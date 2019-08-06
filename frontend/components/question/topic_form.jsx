import React from 'react';
import { withRouter } from "react-router";

class TopicForm extends React.Component {
    constructor(props){
        super(props);
    }



    render() {
        

        const topicOptions = this.props.availableTopics.map(topic=>{
            return <option key={topic.id} value={topic.id}>{topic.name}</option>
        })

        return (<div>
            <form>
                <select name="available_topics">
                   {topicOptions}
                </select>
                <input type="submit" value="Add Topic"/>
            </form>
        </div>)
    }
}


export default withRouter(TopicForm);