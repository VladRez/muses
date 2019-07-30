import React from 'react';
import {
    Route,
    Switch,
    Link
} from 'react-router-dom'

import {AuthRoute} from '../util/route_util';
import LoginFormContainer from './session_form/login_form_container'
const App = () =>(
    <div>
        <Switch>
            <AuthRoute exact path="/login" component={LoginFormContainer} />
        </Switch>
    </div>
)

export default App;