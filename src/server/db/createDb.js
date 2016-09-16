
export function createDatabase(server, name, classes) {
  server.create({
    name,
    type: 'graph',
    storage: 'plocal'
  }).then(db => {
    console.log('Created Database:', db.name);
    classes.forEach(v => {
      db.class.create(v.name, 'V');
    });
  });
}

