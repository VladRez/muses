import React from 'react';
import { Link } from 'react-router-dom';

class Question extends React.Component{

    componentDidMount(){
        
        let id = this.props.match.params.question_id
        this.props.fetchQuestion(id)
    }

    render() {
        
        return (<div>
            {JSON.stringify(this.props.question)}
        </div>)
    }
}
    

export default Question;