import React from 'react';
import { withRouter } from 'react-router-dom';

class SessionForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.props.default_user
        this.handleLogin = this.handleLogin.bind(this)
        this.handleSignup = this.handleSignup.bind(this)
    }

    update(frmType, field) {
        let property = { ...this.state[frmType] }
        return (e) => this.setState({
            [frmType]: Object.assign(this.state[frmType], { [field]: e.target.value })
        });
    }

    handleLogin(e) {
        e.preventDefault();
        this.props.login(this.state);
    }

    handleSignup(e) {
        e.preventDefault();
        this.props.signup(this.state);
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

                            <div className="signUpLogin">
                                <div className="signup">

                                    <form onSubmit={this.handleSignup}>
                                        <div className="title">Sign Up</div>

                                        <div className="stackedForm">
                                            <div className="firstLastNameGroup">
                                                <div className="formRow half">
                                                    <label>First Name</label>

                                                    <input className="text" type="text" tabIndex="9"
                                                        value={this.state.signup.first_name}
                                                        onChange={this.update('signup', 'first_name')}
                                                    />

                                                </div>
                                                <div className="formRow half">
                                                    <label>Last Name</label>

                                                    <input className="text" type="text" tabIndex="9"
                                                        value={this.state.signup.last_name}
                                                        onChange={this.update('signup', 'last_name')}
                                                    />

                                                </div>
                                            </div>

                                            <div className="formRow">
                                                <label>Email</label>

                                                <input className="text" type="text"
                                                    value={this.state.email}
                                                    onChange={this.update('signup', 'email')}
                                                />

                                            </div>

                                            <div className="formRow">
                                                <label>Password</label>

                                                <input className="text" type="password"
                                                    value={this.state.signup.password}
                                                    onChange={this.update('signup', 'password')}
                                                />

                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="formButtons">

                                                <input className="submitButton" type="submit" value="Sign Up" />

                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="login">


                                    <div className="regularLogin">
                                        <form onSubmit={this.handleLogin}>
                                            <div className="title">Login</div>
                                            <div className="formInputs">
                                                <div className="formColumn">
                                                    <input type="text" id="emailInput" placeholder="Email" className="text headerLoginTextBox"
                                                        value={this.state.login.email}
                                                        onChange={this.update('login', 'email')} />
                                                </div>
                                                <div className="formColumn">
                                                    <input type="password" id="passwordInput" placeholder="Password" className="text headerLoginTextBox"
                                                        value={this.state.login.password}
                                                        onChange={this.update('login', 'password')} />
                                                </div>
                                                <div className="formColumn">
                                                    <input className="submitButton" id="loginButton" type="submit" value="Login" />
                                                    <input type="hidden" name="email" value='ajakubczyk0@tiny.cc'/>
                                                    <button id="demoButton" onClick={()=>{this.state=this.props.demo_user}} className="submitButton demoButton">Demo</button>
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
        )
    }
}

export default withRouter(SessionForm)