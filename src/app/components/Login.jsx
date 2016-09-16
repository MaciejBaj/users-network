import React from 'react';
import { Link } from 'react-router';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import {LoginForm, LOGIN_MODES} from './LoginForm.jsx';

export class Login extends React.Component {
  render() {
    return (
      <div>
        <LoginForm mode={LOGIN_MODES.login}></LoginForm>
      </div>
    )
  }
}
