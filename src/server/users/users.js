'use strict';
import {Auth} from '../auth';

export class Users {

  static *isAdmin(next) {
    if (this.session.user && this.session.user.role === 'admin') {
      yield next;
    }
    else {
      this.throw(401, 'access_denied');
    }
  }
  
  static *getAll(next) {
    this.body = yield this.app.db.getAll();
  }
  
  static *getById(next) {
    this.body = yield this.app.db.getById(this.params.id);
  }

  static *insert(next) {
    this.body = yield this.app.db.insert(this.request.body);
  }

  static *update(next) {
    this.throw(501, "not_implemented");
  }

  static *delete(next) {
    this.body = yield this.app.db.delete(this.params.id);
  }

  static *addConnection(next) {
    const requestingUser = this.request.body.requestingUser;
    const userToConnect = this.request.body.userToConnect;
    if (!requestingUser || !userToConnect) {
      this.throw(400, "bad request");
    }
    else {
      this.body = yield this.app.db.addConnection(requestingUser, userToConnect);
    }
  }

}