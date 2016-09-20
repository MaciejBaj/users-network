import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import { Admin } from './components/Admin.jsx';
import { AppRoot } from './components/AppRoot.jsx';
import LoginForm from "./components/LoginForm.jsx";
import UsersNetwork from './components/UsersNetwork.jsx';

class AppRoutes extends React.Component {

  render () {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={AppRoot}> }>
          <Route path="/login" component={() => (<LoginForm mode={LoginForm.LOGIN_MODES.login}/>)}/>
          <Route path="/signIn" component={() => (<LoginForm mode={LoginForm.LOGIN_MODES.signIn}/>)}/>
          <Route path="/app" component={UsersNetwork}/>
          <Route path="/admin" component={Admin}/>
        </Route>
      </Router>
    );
  }
}

export default AppRoutes;
