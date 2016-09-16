import React from 'react';

import {LoginForm, LOGIN_MODES} from './LoginForm.jsx';

export class SignIn extends React.Component {
  render() {
    return (
      <LoginForm mode={LOGIN_MODES.signIn}></LoginForm>
    )
  }
}
