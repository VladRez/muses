import React from 'react';
import { withRouter } from 'react-router-dom';

class SessionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    update(field) {
        return (e) => this.setState({
            [field]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.login(this.state);
    }


    render() {

        return (
            <div className="loggedOutPage">
                <div className="contentWrapper">
                    <div className="bgContainer">
                        <div className="bgImage">
                        </div>
                    </div>

                    <div className="baseSignUpContainer">
                        <div className="projectLogo"></div>
                        <h2 className="tagline">Where questions are asked, answered, and edited by users.</h2>

                        <div className="formContainer">
                            <div className="innerContentFormContainer">
                                <div className="signUpLogin">
                                    <div className="signup">

                                        <form onSubmit={this.handleSubmit}>
                                            <div className="emailSignupForm">
                                                <div className="stackedForm">
                                                    <div className="firstLastNameGroup">
                                                        <div className="formRow half">
                                                            <label>First Name</label>
                                                            <div className="inputWrapper">
                                                                <input className="text" type="text" tabindex="9"/>
                                                            </div>
                                                        </div>
                                                        <div className="formRow half lastName">
                                                            <label>Last Name</label>
                                                            <div className="inputWrapper">
                                                                <input className="text" type="text" tabindex="9"/>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="formRow">
                                                        <label>Email</label>
                                                        <div className="inputWrapper">
                                                            <input className="text" type="text" />
                                                        </div>
                                                    </div>

                                                    <div className="formRow">
                                                        <label>Password</label>
                                                        <div className="inputWrapper">
                                                            <input className="text" type="password" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="formButtons">
                                                    <span >
                                                        <input className="submitButton" type="submit" value="Sign Up" />
                                                    </span>
                                                </div>
                                            </div>
                                        </form>
                                    </div>




                                    <div className="login">

                                        <div className="inlineLogin">
                                            <div className="regularLogin">
                                                <form className="inlineLoginForm" onSubmit={this.handleSubmit}>
                                                    <div className="title loginTitle">Login</div>
                                                    <div className="formInputs">
                                                        <div className="formColumn">
                                                            <input type="text" placeholder="Email" className="text headerLoginTextBox" />
                                                        </div>
                                                        <div className="formColumn">
                                                            <input type="password" placeholder="password" className="text headerLoginTextBox" />
                                                        </div>
                                                        <div className="formColumn">
                                                            <input className="submitButton" type="submit" value="Login" />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

export default withRouter(SessionForm)