import React from 'react';
import { withRouter } from "react-router";

class CommentAnswerForm extends React.Component {
    constructor(props) {
        super(props);

    }

    update(field) {

    }

    handleSubmit(e) {

    }
    render() {
        return (<div className="addCommentGroup">
            <div className="addCommentProfileAvatar">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfBY-Rgh-5AduJ15F_FBljvzkeEdOTRuAWavFEC0XzNPrQoPYdLg" />
            </div>
            <form>
                <input type="text" className="addCommentInput" placeholder="Add a Comment" />
                <input type="submit" className="submitButton" value="Add Comment"/>
            </form>
        </div>)
    }
}

export default withRouter(CommentAnswerForm);