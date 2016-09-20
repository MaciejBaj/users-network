import bcrypt from 'bcrypt-nodejs';

export function createDatabase(server, name) {
  server.create({
    name,
    type: 'graph',
    storage: 'plocal'
  }).then(db => {
    db.class.create('User', 'V');
    console.log('Created Database:', db.name);
    db.query(`INSERT INTO User CONTENT ${JSON.stringify({
      login: 'admin',
      role: 'admin',
      password: bcrypt.hashSync('admin')
    })}`).then(() => {
      console.log('Inserted user: "admin", pwd: "admin"');
    });

    return db.query(`INSERT INTO User CONTENT ${JSON.stringify({
      login: 'user',
      role: 'user',
      password: bcrypt.hashSync('user')
    })}`).then(() => {
      console.log('Inserted user: "user", pwd: "user"');
    });

  })
}

