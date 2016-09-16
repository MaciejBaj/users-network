var OrientDB = require('orientjs');
import {OrientDatabase} from "./orientDatabase"; 

export class OrientDBServer {
  
  constructor(host, username, password, port = 2424) {
    this.server = OrientDB({
      host,
      port,
      username,
      password
    });
  }

  connectDb(name, user, password) {
    const db = this.server.use({
      name,
      user,
      password
    });
    
    return new OrientDatabase(db);
    
  }

  hasDatabase(name) {
    return this.server.list()
      .then(databases => databases.some(db => db.name === name))
  }
}

