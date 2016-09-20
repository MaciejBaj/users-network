import React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import * as _ from 'lodash';

import { connect } from 'react-redux'

class Navbar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppBar
        title="users network"
        iconElementLeft={<p></p>}
        iconElementRight={
          this.props.isLogged ? (
            <IconMenu
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText="Sign out" onTouchTap={() => {window.location.href = '/logout'}} />
              {this.props.isAdmin ? (
                <MenuItem primaryText="Admin panel" onTouchTap={() => {window.location.href = '/admin'}} />
              ) : null}
            </IconMenu>
          ) : null
        }
      />
    );
  }
}

const isLogged = (user) => {
  return !_.isEmpty(user);
};

const isAdmin = (user) => {
  return _.get(user, 'role', false) === 'admin';
};

const mapStateToProps = (state) => {
  return {
    isLogged: isLogged(state.user),
    isAdmin: isAdmin(state.user)
  }
};

export default connect(mapStateToProps)(Navbar);
