import React from 'react';
import {getReq, post} from '../helpers/requests';
import { connect } from 'react-redux'
import {List, ListItem} from 'material-ui/List';
import PersonIcon from 'material-ui/svg-icons/social/person';
import Divider from 'material-ui/Divider';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

class UsersNetwork extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      connections: [],
      users: []
    }
  }

  static fetchUsersAndEdges(singleUser = true) {
    const usersLoaded = new Promise((resolve, reject) => {
      getReq('api/v1/users', res => resolve(JSON.parse(res.target.response)));
    });

    const edgesLoaded = new Promise((resolve, reject) => {
      getReq(`api/v1/user${singleUser ? '' : 's'}/connections`, res => resolve(JSON.parse(res.target.response)));
    });

    return Promise.all([usersLoaded, edgesLoaded]);
  }

  componentDidMount() {
    UsersNetwork.fetchUsersAndEdges().then(([users, edges]) => {
      const connections = edges.map(edge => users.find(user => user['@rid'] === edge.in));
      this.setState({
        connections,
        users: _.differenceBy(users, connections, '@rid')
      });
    });
  }

  handleSelectedChange(event, index, value){
    this.setState({'selected': value});
  }

  connect() {
    post('api/v1/users/connection', {
      userToConnect: this.state.selected,
      requestingUser: this.props.user
    }, (res) => {
      if (res.target.status === 200) {
        this.componentDidMount();
      }
    });
  }

  render () {
    console.log("users network props render", this.props.user);
    return (
      <div>
        <h2>Dear {this.props.user.login}, welcome to users network</h2>
        <Divider />
        <h3>Search for new connections</h3>
        <SelectField value={this.state.selected} onChange={this.handleSelectedChange.bind(this)}>
          {this.state.users.map((user) => <MenuItem value={user} primaryText={user.login} key={user['@rid']} />)}
        </SelectField>
        <br/>
        {this.state.selected.login ?
          <FlatButton onClick={this.connect.bind(this)} primary={true} label={`connect with ${this.state.selected.login}`} /> : null}
        <Divider />
        <h3>Your connections</h3>
        <List>
          {this.state.connections.map((connection, i) => <ListItem key={i} primaryText={connection.login} rightIcon={<PersonIcon />} />)}
        </List>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
};

export default connect(
  mapStateToProps
)(UsersNetwork);


