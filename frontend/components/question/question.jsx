import React from 'react';
import { Link } from 'react-router-dom';
import AnswerIndexContainer from '../answers/answer_index_container';
import TopicIndexContainer from './topic_index_container'

import { withRouter } from "react-router";

class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.props.options
        this.displayEditForm = this.displayEditForm.bind(this)
    }
    componentDidMount() {
        let id = this.props.match.params.question_id

        this.props.fetchQuestion(id)
        this.props.fetchTopics()
    }

    componentWillReceiveProps(nextProps) {
            this.displayEditForm(false)
 
    }

    displayEditForm(bln) {
        this.setState({ displayEdit: bln })
    }

    
    render() {
        let question = '';
        let answers = [];
        let questionTopics = [];
        let isAuthor = false;
        if (this.props.question !== undefined) {
            question = this.props.question.question
            if (Object.values(this.props.topics).length) {
                questionTopics = this.props.question.topics.map(t => this.props.topics[t])
            }
            answers = this.props.answers
            isAuthor = this.props.question.question_author_id === this.props.currentUserId
        }



        let deleteLink = isAuthor ? <a href="" onClick={() => this.props.deleteQuestion(this.props.match.params.question_id)}>Remove</a> : ''
        let editBtn = isAuthor ? <button onClick={() => this.displayEditForm(!this.state.displayEdit)}>Edit</button> : ''

        return (<div>

            {/* <Link to='/'>All Questions</Link> */}

            <div className="questionPage">
                <div className="contentWrapper">
                    <div className="layout2colMain">
                        <div className="questionHeader">
                            <TopicIndexContainer questionTopics={questionTopics} />
                            <span className="questionPageText">{this.state.displayEdit ? this.props.editForm : question}</span>
                            {deleteLink}
                            {editBtn}
                        </div>

                        <AnswerIndexContainer answers={answers} />
                    </div>
                </div>
            </div>

        </div>)
    }
}


export default withRouter(Question);