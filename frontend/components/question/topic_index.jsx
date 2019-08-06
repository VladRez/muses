import React from 'react'

class TopicIndex extends React.Component {


    render() {
        
        const topics = this.props.questionTopics.map(topic=>{
            return <div key={topic.id}className="questionTopicHeaderListItem">
                <a href="#">{topic.name}</a>
            </div>
        })
        return (<div className="questionTopicHeaderList">
            {topics}
        </div>)
    }
}

export default TopicIndex