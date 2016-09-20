import React from 'react';
import { FlatButton, TextField, Snackbar } from 'material-ui';
import { post } from '../helpers/requests';
import { connect } from 'react-redux'
import { addUser } from '../actions'

class LoginForm extends React.Component {

  static get LOGIN_MODES() {
   return {
     login: 'login',
     signIn: 'signIn'
   }
  };

  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      errorMessage: '',
      showAlert: false
    }
  }

  onFieldChanged (event) {
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmit (event) {
    event.preventDefault();
    const { login, password } = this.state;
    const urlAddress = LoginForm.LOGIN_MODES[this.props.mode] || LoginForm.LOGIN_MODES.login;
    post(urlAddress, { login, password }, (response) => {
      if (response.target.status !== 200) {
        this.setState({errorMessage: response.target.responseText, showAlert: true});
      }
      else {
        this.props.dispatch(addUser(JSON.parse(response.target.response)));
        this.props.history.push('/app');
      }
    }, (error) => {
      console.error(error);
    });
  }

  onErrorSnackbarClose() {
    this.setState({showAlert: false});
  }

  render() {
    return (
      <div className="login__container">
        <form onSubmit={this.onSubmit.bind(this)} onChange={this.onFieldChanged.bind(this)}>
          <div>
              <TextField
                name="login"
                hintText="login"
                type="text"
                floatingLabelText="login"
                errorText = {this.state.login.touched && this.state.login.error}
                {...this.state.login}
              />
          </div>
          <div>
            <TextField
              name="password"
              hintText = "password"
              type="password"
              floatingLabelText="password"
              errorText={this.state.password.touched && this.state.password.error}
              {...this.state.password}
            />
          </div>
          <div>
            <FlatButton
              type="submit"
              label={this.props.mode === LoginForm.LOGIN_MODES.signIn ? 'sign in' : 'login'}
              primary={true} />
            <FlatButton
              type="button"
              label={this.props.mode === LoginForm.LOGIN_MODES.signIn ? 'login' : 'sign in'}
              primary={true}
              onClick={() => {window.location.href = this.props.mode === LoginForm.LOGIN_MODES.signIn ? '/login' : '/signIn'}}/>
          </div>
          <Snackbar
            open={this.state.showAlert}
            message={this.state.errorMessage}
            autoHideDuration={4000}
            bodyStyle={{background: "red"}}
            onRequestClose={this.onErrorSnackbarClose.bind(this)}
          />
        </form>
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    history: state.history
  }
};

export default connect(mapStateToProps)(LoginForm);
