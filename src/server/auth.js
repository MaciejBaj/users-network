"use strict";
import bcrypt from 'bcrypt-nodejs';

export class Auth {
  
  static *isAuthenticated(next) {
    console.log("isAuthenticated", this.session.user);
    if(this.session.user) {
      yield next;
    }
    else {
      this.redirect('/login');
    }
  }

  static *isAdmin(next) {
    if (this.session.user && this.session.user.role === 'admin') {
      yield next;
    }
    else {
      this.throw(401, 'access_denied');
    }
  }

  static *login(next) {
    const [password, login] = [this.request.body.password, this.request.body.login];
    console.log("password>login", password, login, this.request.body);

    const user = yield this.app.db.get('login', login, 'User');
    console.log("login>user", user);
    if (!user) {
      this.throw(`user ${login} not found`, 401);
    }
    if (bcrypt.compareSync(password, user.password)) {
      this.session.user = user;
      console.log("logged!");
      delete user.password;
      this.body = user;
    }
    else {
      console.log("not logged");
      this.session.user = null;
    }
    yield next;
  }

  static *signIn(next) {
    const [password, login] = [this.request.body.password, this.request.body.login];
    if (password.length <= 3 || login.length <= 3) {
      this.throw(417, 'credentials should be at least 4 characters long');
    }
    const potientialUser = yield this.app.db.get('login', login, 'User');
    if (potientialUser) {
      this.throw(417, `user ${login} already exists`);
    }    
    this.body = yield this.app.db.insert({login, password: bcrypt.hashSync(password), role: 'user'}, 'User');
    this.redirect('/login');
  }

  static *logout(next) {
    this.session.user = null;
    this.redirect('/login');
  }
}