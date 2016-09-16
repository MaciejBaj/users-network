import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { browserHistory } from 'react-router';

export class AppRoot extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="users network"
            iconElementLeft={<p></p>}
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem primaryText="Sign out" onTouchTap={() => {window.location.href = '/logout'}} />
              </IconMenu>
            }
          />
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}
