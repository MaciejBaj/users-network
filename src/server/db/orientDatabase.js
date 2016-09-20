export class OrientDatabase {
  constructor(db) {
    this.db = db;
  }

  getById(id, className) {
    return this.db.select().from(className).where({
        '@rid': `#${id}`
      }).one();
  }

  get(field, value, className) {
    return this.db.select().from(className).where({
      [field]: value
    }).one();
  }

  getAll(fields, className) {
    return this.db.select().from(className).all();
  }

  insert(data, className) {
    return this.db.query(`INSERT INTO ${className} CONTENT ${JSON.stringify(data)}`);
  }

  delete(id, className) {
    return this.db.delete().from(className)
      .where(`@rid = #${id}`).limit(1).scalar();
  }

  addConnection(requestingUser, userToConnect, edgeName) {
    return this.db.create('EDGE', edgeName)
      .from(requestingUser['@rid']).to(userToConnect['@rid']).one();
  }

  getEdges(query, edgeName) {
    return query ?
      this.db.select().from(edgeName).where(query).all() :
      this.db.select().from(edgeName).all();
  }

}