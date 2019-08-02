import React from 'react';
import { connect } from 'react-redux';
import { login, signup } from '../../actions/session_actions';
import SessionForm from './session_form'

const mapStateToProps = (state) => {

    return {
        errors: state.errors.session,
        default_user: { 
            signup: {first_name: '', last_name: '', email: '', password: ''},
            login: {email: '', password:''}
        },
        demo_user: {
            login: {email: 'ajakubczyk0@tiny.cc', password:'OgUq8GUitk'}
        }
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        signup: (user) => dispatch(signup(user['signup'])),
        login: (user) => dispatch(login(user['login']))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionForm);