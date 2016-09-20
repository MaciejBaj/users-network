import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navbar from './Navbar.jsx';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {appReducers} from '../reducers';
import {addHistory, addUser} from '../actions';
import {getReq} from '../helpers/requests';


const store = createStore(appReducers);

export class AppRoot extends React.Component {

  constructor(props) {
    super(props);
    store.dispatch(addHistory(props.history));
  }

  componentDidMount() {
    getReq('api/v1/user', (res) => {
      try {
        const user = JSON.parse(res.target.response);
        store.dispatch(addUser(user));
      }
      catch(err) { }
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <Provider store={store}>
          <div className="app__container">
            <Navbar/>
            {this.props.children}
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}
