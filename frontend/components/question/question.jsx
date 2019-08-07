import React from 'react';
import { Link } from 'react-router-dom';
import AnswerIndexContainer from '../answers/answer_index_container';
import TopicIndexContainer from './topic_index_container'
import { withRouter } from "react-router";

class Question extends React.Component {

    componentDidMount() {
        let id = this.props.match.params.question_id
        this.props.fetchQuestion(id)
        this.props.fetchTopics()
    }

    render() {
        let question = '';
        let answers = [];
        let questionTopics = [];
        if (this.props.question !== undefined){
            question = this.props.question.question
            if(Object.values(this.props.topics).length){
                questionTopics = this.props.question.topics.map(t=>this.props.topics[t])
            }
            answers = this.props.answers
        }
        
        
        return (<div>
            {/* <Link to='/'>All Questions</Link> */}
            <div className="questionPage">
                <div className="contentWrapper">
                    <div className="layout2colMain">
                        <div className="questionHeader">
                            <TopicIndexContainer questionTopics={questionTopics}/>
                            <span className="questionPageText">{question}</span>
                        </div>
                        <AnswerIndexContainer answers={answers} />
                    </div>
                </div>
            </div>
            
        </div>)
    }
}


export default withRouter(Question);