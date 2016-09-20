'use strict';

export class Users {
  
  static *getAll(next) {
    const users = yield this.app.db.getAll(null, 'User');
    this.body = users.map(user => {
      delete user.password;
      return user;
    });
  }
  
  static *getById(next) {
    this.body = yield this.app.db.getById(this.params.id, 'User');
  }

  static *getLoggedUser(next) {
    this.body = yield this.session.user || {};
  }

  static *insert(next) {
    this.body = yield this.app.db.insert(this.request.body, 'User');
  }

  static *update(next) {
    this.throw(501, "not_implemented");
  }
  
  static *getConnections(next) {
    this.body = yield this.app.db.getEdges(null, 'ConnectedWith');
  }

  static *delete(next) {
    this.body = yield this.app.db.delete(this.params.id, 'User');
  }
  
  static *getUserConnections(next) {
    this.body = yield this.app.db.getEdges({out: this.session.user['@rid']}, 'ConnectedWith');
  }

  static *addConnection(next) {
    const requestingUser = this.request.body.requestingUser;
    const userToConnect = this.request.body.userToConnect;
    if (!requestingUser || !userToConnect) {
      this.throw(400, "bad request");
    }
    else {
      this.body = yield this.app.db.addConnection(requestingUser, userToConnect, 'ConnectedWith');
    }
  }

}