import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import {AppRoot} from './components/AppRoot.jsx';
import {UsersNetwork} from './components/UsersNetwork.jsx';
import {NoMatch} from './components/NoMatch.jsx';
import {SignIn} from './components/SignIn.jsx';
import {Login} from './components/Login.jsx';

class AppRoutes extends React.Component {

  render () {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={AppRoot}> }>
          <Route path="/signIn" component={SignIn}/>
          <Route path="/login" component={Login}/>
          <Route path="/app" component={UsersNetwork}/>
        </Route>
      </Router>
    );
  }
}

export default AppRoutes;