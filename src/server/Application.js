import path from 'path';
import koa from 'koa';
import logger from 'koa-logger';
import serve from 'koa-static';
import Router from 'koa-router';

import session from 'koa-session-redis';
import bodyParser from 'koa-bodyparser';
import {Auth} from './auth';

import {createDatabase} from './db/createDb';
import {OrientDBServer} from './db/orientServer';
import {classes} from './db/usersNetworkDbStructure';
import render from './lib/render';
import {Users} from './users/users';

export class Application {

  constructor(name) {
    this.name = name;
    this.app = koa();
    this.useLogger();
    this.serveStatics();
    this.routes();
    this.connectDbAndStartApi();
    // const defaultRedirectRouter = new Router();
    // defaultRedirectRouter.get('/*', this.home);
    // this.app.use(defaultRedirectRouter.routes());

    this.start();
  }

  *home() {
    this.body = yield render('home', {name: this.name});
  }

  *redirectToApp() {
    this.redirect('/app');
  }
  
  useLogger() {
    this.app.use(logger());
  }

  serveStatics() {
    this.app.use(serve(path.join(__dirname, '../../dist')));
  }

  startApi() {
    const apiRouter = new Router({
      prefix: '/api/v1'
    });

    apiRouter
      .get('/user', Users.getLoggedUser)
      .get('/users', Auth.isAuthenticated, Users.getAll)
      .get('/users/:id', Auth.isAuthenticated, Users.getById)
      .post('/users', Auth.isAuthenticated, Users.insert)
      .put('/users', Auth.isAuthenticated, Users.update)
      .del('/users/:id', Auth.isAuthenticated, Users.delete)
      .post('/users/connection', Auth.isAuthenticated, Users.addConnection)
      .get('/user/connections', Auth.isAuthenticated, Users.getUserConnections)
      .get('/users/connections', Auth.isAuthenticated, Auth.isAdmin, Users.getConnections);

    this.app.use(apiRouter.routes());
  }
  
  routes() {

    const router = new Router();
    router
      .get('/', Auth.isAuthenticated, this.redirectToApp)
      .get('/app', Auth.isAuthenticated, this.home)
      .get('/admin', Auth.isAuthenticated, Auth.isAdmin, this.home)
      .post('/login', Auth.login)
      .post('/signIn', Auth.signIn)
      .get('/logout', Auth.logout)
      .get('/login', this.home);

    this.app.keys = ['your-session-secret'];
    this.app.use(session({
        store: {
          host: process.env.SESSION_PORT_6379_TCP_ADDR || '127.0.0.1',
          port: process.env.SESSION_PORT_6379_TCP_PORT || 6379,
          ttl: 3600
        }
      },
    ));
    this.app.use(bodyParser());
    this.app.use(router.routes());
  }

  start() {
    if (module.parent) {
      this.app.listen(3000);
      console.log('listening on port 3000...');
    }
  }

  connectDbAndStartApi() {
    const dbServer = new OrientDBServer('localhost', 'root', 'rootpwd');

    dbServer.hasDatabase(this.name).then((hasDb) => {
      if (!hasDb) {
        createDatabase(dbServer.server, this.name, classes);
      }

      this.app.db = dbServer.connectDb(this.name, 'admin', 'admin');

      this.startApi();

      this.app.callback(() => {
        dbServer.server.close();
        console.log(`${this.name} terminated`);
      });      
    });   
    
  }
}