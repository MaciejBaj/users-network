export class OrientDatabase {
  constructor(db) {
    this.db = db;
  }

  getById(id) {
    return this.db.select().from('User').where({
        '@rid': `#${id}`
      }).one();
  }

  get(field, value) {
    return this.db.select().from('User').where({
      [field]: value
    }).one();
  }

  getAll() {
    return this.db.select().from('User').all();
  }

  insert(data) {
    return this.db.query(`INSERT INTO User CONTENT ${JSON.stringify(data)}`);
  }

  delete(id) {
    return this.db.delete().from('User')
      .where(`@rid = #${id}`).limit(1).scalar();
  }

  addConnection(requestingUser, userToConnect) {
    return this.db.create('EDGE', 'ConnectedWith')
      .from(requestingUser['@rid']).to(userToConnect['@rid']).one();
  }

}