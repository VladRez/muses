import React from 'react'


class TopicFeed extends React.Component {

    componentDidMount() {
        this.props.fetchTopics()
    }

    filterQByTopic(id) {
        let params = {field: 'topic', value: `${id}`}
        this.props.fetchQuestions(params)
        
        this.forceUpdate();
    }

    render() {

        let topics = this.props.topics;
        if (topics.length) {
            topics = topics.map(topic => {
                
                return (<li key={topic.id} className="topicItem">
                    <a href="#" onClick={()=>this.filterQByTopic(topic.id)} className="topicItemLink">
                        <div className="topicItemLinkImage"></div>
                        <div className="topicLabel">{topic.name}</div>
                    </a>
                </li>)
            });
        }
        
        return (<div className="layout3ColLeft">
            <div className="leftColInner">
                <ul>
                    {topics}
                </ul>
            </div>
        </div>)
    }
}

export default TopicFeed