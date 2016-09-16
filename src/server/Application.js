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
      .get('/users', Users.isAdmin, Users.getAll)
      .get('/users/:id', Users.getById)
      .post('/users', Users.insert)
      .put('/users', Users.update)
      .del('/users/:id', Users.delete)
      .post('/users/connection', Users.addConnection);

    this.app.use(apiRouter.routes());
  }
  
  routes() {

    const router = new Router();
    router
      .get('/', Auth.isAuthenticated, this.redirectToApp)
      .get('/*', this.home)
      .get('/app', Auth.isAuthenticated, this.home)
      // .get('/login', Auth.login)
      .post('/login', Auth.login)
      .post('/signIn', Auth.signIn)
      .get('/logout', Auth.logout);

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