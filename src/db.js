const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('./db/p6Static.json');
const connection = lowdb(adapter);

const init = async dbConnection => {
  const db = await dbConnection;
  db.defaults({ resource: [] });
  return db;
};

module.exports = init(connection);
