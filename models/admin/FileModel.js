var config = require('../../config');


exports.saveFile = (fileData, callback) => {
  const query = 'INSERT INTO files (name, description, filename) VALUES (?, ?, ?)';
  db.execute(query, [fileData.name, fileData.description, fileData.filename], callback);
};
